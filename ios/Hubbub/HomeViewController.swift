//
//  HomeViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/18/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import AlamofireImage
import Firebase
import FirebaseDatabaseUI
import SnapKit
import UIKit

class HomeViewController: UIViewController, UITableViewDelegate {
    
    // UI
    var profileImageView:UIImageView!
    var usernameLabel:UILabel!
    var slotsTableView:UITableView!
    
    // Internal Properties
    internal var user:FIRUser
    internal var oauthClient:OAuthClient
    internal var account:Account?
    internal var accountRef:FIRDatabaseReference?
    internal var profileRef:FIRDatabaseReference?
    internal var slotsQuery:FIRDatabaseQuery?
    internal var slotsDatasource:FUITableViewDataSource?
    
    required init(user:FIRUser, oauthClient:OAuthClient) {
        self.user = user
        self.oauthClient = oauthClient
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Nav Bar
        navigationItem.title = "Hubbub"
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(doLogout))
        
        // Profile Image
        profileImageView = UIImageView()
        profileImageView.backgroundColor = UIColor.lightGray
        view.addSubview(profileImageView)
        profileImageView.snp.makeConstraints { (make) in
            make.width.equalTo(150)
            make.height.equalTo(150)
            make.top.equalTo(topLayoutGuide.snp.bottom).offset(20)
            make.left.equalToSuperview().offset(20)
        }
        
        // Username
        usernameLabel = UILabel()
        usernameLabel.text = "Loading..."
        view.addSubview(usernameLabel)
        usernameLabel.snp.makeConstraints { (make) in
            make.top.equalTo(profileImageView.snp.top)
            make.left.equalTo(profileImageView.snp.right).offset(20)
        }
        
        // Your Slots
        let yourSlotsLabel = UILabel()
        yourSlotsLabel.text = "Upcoming Lunches:"
        view.addSubview(yourSlotsLabel)
        yourSlotsLabel.snp.makeConstraints { (make) in
            make.left.equalTo(profileImageView.snp.left)
            make.top.equalTo(profileImageView.snp.bottom).offset(20)
        }
        
        // Slots
        slotsTableView = UITableView(frame: .zero, style: .plain)
        slotsTableView.delegate = self
        view.addSubview(slotsTableView)
        slotsTableView.snp.makeConstraints { (make) in
            make.left.equalTo(yourSlotsLabel.snp.left).offset(10)
            make.right.equalToSuperview()
            make.top.equalTo(yourSlotsLabel.snp.bottom)
            make.bottom.equalToSuperview()
        }
        slotsTableView.register(UITableViewCell.self, forCellReuseIdentifier: "slotsCell")
        
        // TODO: Shouldn't be listening to the entire account object because /slots can get large
        bindAccount()
        
        bindSlots()
        bindProfile()
    }
    
    deinit {
        if let ref = profileRef {
            ref.removeAllObservers()
        }
        if let ref = accountRef {
            ref.removeAllObservers()
        }
        if let query = slotsQuery {
            query.removeAllObservers()
        }
    }

    // MARK: Internal
    
    internal func doLogout() {
        try? FIRAuth.auth()?.signOut()
    }
    
    internal func bindSlots() {
        // Fetch the next 10 slots (including up to an hour ago to account for ongoing slots)
        let startTime = Date().timeIntervalSince1970 - (60*60)
        slotsQuery = FIRDatabase.database().reference().child("slots")
            .queryOrdered(byChild: "timestamp")
            .queryStarting(atValue: startTime)
            .queryLimited(toFirst: 10)
        
        slotsDatasource = slotsTableView.bind(to: slotsQuery!, populateCell: { [unowned self] (tableView, indexPath, snapshot) -> UITableViewCell in
            let cell = tableView.dequeueReusableCell(withIdentifier: "slotsCell", for: indexPath)
            if let slot = Slot(snapshot: snapshot), var name = slot.name {
                if (self.account?.hasRequestForSlot(id: slot.id) ?? false) {
                    name += " \u{2611}"
                }
                cell.textLabel?.text = name
            }
            return cell
        })
    }
    
    internal func bindProfile() {
        profileRef = FIRDatabase.database().reference().child("profile").child(user.uid)
        profileRef!.observe(.value, with: { [unowned self] (snapshot) in
            let data = snapshot.value as? [String : AnyObject] ?? [:]
            if let photo = (data["photo"] as? String), let photoURL = URL(string: photo) {
                self.profileImageView.af_setImage(withURL: photoURL)
            }
            if let username = data["handle"] as? String {
                self.usernameLabel.text = username
            }
        })
    }
    
    internal func bindAccount() {
        accountRef = FIRDatabase.database().reference().child("account").child(user.uid)
        accountRef!.observe(.value, with: { [unowned self] (snapshot) in
            self.account = Account(snapshot: snapshot)
            self.slotsTableView.reloadData()
        })
    }
    
    internal func toggleSlot(slot:Slot) {
        // Capture some data so the block below doesn't need self
        let userID = user.uid

        // Start by fetching the user's existing request for the given day, if any
        let rootRef = FIRDatabase.database().reference()
        rootRef.child("accounts/\(userID)/slots/\(slot.id)").observeSingleEvent(of: .value, with: { (snapshot) in
            // Build a set of updates
            var updates = [String:Any?]()

            if let existingSlot = Slot(snapshot: snapshot) {
                // If a topic has already been assigned, the user can't leave the slot!
                if existingSlot.topicID != nil {
                    return
                }

                // Leave the slot by deleting the request and the account entry
                let val:Any? = nil
                updates["requests/\(existingSlot.id)/\(userID)"] = val
                updates["accounts/\(userID)/slots/\(existingSlot.id)"] = val
            } else {
                // Create a new request
                updates["requests/\(slot.id)/\(userID)"] = true
                
                // Create or update an account slot
                updates["accounts/\(userID)/slots/\(slot.id)"] = ["timestamp": slot.timestamp]
            }

            // Apply all updates atomically
            rootRef.updateChildValues(updates)
        })
    }
    
    // MARK: UITableViewDelegate
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if let slotSnapshot = slotsDatasource?.items[indexPath.row] {
            if let slot = Slot(snapshot: slotSnapshot) {
                toggleSlot(slot: slot)
            }
        }
        tableView.deselectRow(at: indexPath, animated: true)
    }
}
