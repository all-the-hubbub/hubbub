//
//  HomeViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/18/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import FirebaseDatabaseUI
import MaterialComponents
import MaterialComponents.MaterialPalettes
import SnapKit
import UIKit

class HomeViewController: UIViewController, UITableViewDelegate {
    
    // UI
    let appBar = MDCAppBar()
    let headerView = HomeHeaderView()
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
        
        addChildViewController(appBar.headerViewController)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        appBar.addSubviewsToParent()
        appBar.headerViewController.headerView.backgroundColor = MDCPalette.blue().tint500
        if let navShadowLayer = appBar.headerViewController.headerView.shadowLayer as? MDCShadowLayer {
            navShadowLayer.elevation = 3
        }
        
        // Nav Bar
        navigationItem.title = "Hubbub"
        navigationItem.rightBarButtonItem = UIBarButtonItem(image: #imageLiteral(resourceName: "ic_more_vert"), style: .plain, target: self, action: #selector(showActionMenu))
        
        // Header
        headerView.setElevation(points: 2)
        view.insertSubview(headerView, at: 0)
        headerView.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.right.equalToSuperview()
            make.top.equalTo(appBar.headerViewController.headerView.snp.bottom)
        }
        
        // Your Slots
        let yourSlotsLabel = UILabel()
        yourSlotsLabel.text = "Upcoming Lunches:"
        view.addSubview(yourSlotsLabel)
        yourSlotsLabel.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.top.equalTo(headerView.snp.bottom).offset(20)
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
    
    internal func showActionMenu() {
        let alert = UIAlertController(title: nil, message: nil, preferredStyle: .actionSheet)
        let logout = UIAlertAction(title: "Sign out", style: .destructive) { [unowned self] (action) in
            self.doLogout()
        }
        let cancel = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        alert.addAction(logout)
        alert.addAction(cancel)
        present(alert, animated: true, completion: nil)
    }
    
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
        profileRef = FIRDatabase.database().reference().child("profiles").child(user.uid)
        profileRef!.observe(.value, with: { [unowned self] (snapshot) in
            self.headerView.profile = Profile(snapshot: snapshot)
        })
    }
    
    internal func bindAccount() {
        accountRef = FIRDatabase.database().reference().child("accounts").child(user.uid)
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
