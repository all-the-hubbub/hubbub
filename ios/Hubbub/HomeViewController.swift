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

class HomeViewController: UIViewController {
    
    // UI
    var profileImageView:UIImageView!
    var usernameLabel:UILabel!
    var slotsTableView:UITableView!
    
    // Internal Properties
    internal var user:FIRUser
    internal var oauthClient:OAuthClient
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
        yourSlotsLabel.text = "Your Lunches:"
        view.addSubview(yourSlotsLabel)
        yourSlotsLabel.snp.makeConstraints { (make) in
            make.left.equalTo(profileImageView.snp.left)
            make.top.equalTo(profileImageView.snp.bottom).offset(20)
        }
        
        // Slots
        slotsTableView = UITableView(frame: .zero, style: .plain)
        view.addSubview(slotsTableView)
        slotsTableView.snp.makeConstraints { (make) in
            make.left.equalTo(yourSlotsLabel.snp.left).offset(10)
            make.right.equalToSuperview()
            make.top.equalTo(yourSlotsLabel.snp.bottom)
            make.bottom.equalToSuperview()
        }
        slotsTableView.register(UITableViewCell.self, forCellReuseIdentifier: "slotsCell")
        
        bindSlots()
        bindProfile()
    }
    
    deinit {
        if let ref = profileRef {
            ref.removeAllObservers()
        }
    }

    func doLogout() {
        try? FIRAuth.auth()?.signOut()
    }
    
    internal func bindSlots() {
        slotsQuery = FIRDatabase.database().reference().child("account").child(user.uid).child("slots")
        slotsDatasource = slotsTableView.bind(to: slotsQuery!, populateCell: { (tableView, indexPath, snapshot) -> UITableViewCell in
            let cell = tableView.dequeueReusableCell(withIdentifier: "slotsCell", for: indexPath)
            if let slot = AccountSlot(snapshot: snapshot) {
                cell.textLabel?.text = "\(slot.date) @ \(slot.time)"
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
}
