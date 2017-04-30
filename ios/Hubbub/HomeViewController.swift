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
        
        // Slots
        slotsTableView = UITableView(frame: .zero, style: .plain)
        slotsTableView.backgroundColor = #colorLiteral(red: 0.9333333333, green: 0.9333333333, blue: 0.9333333333, alpha: 1)
        slotsTableView.delegate = self
        view.insertSubview(slotsTableView, at: 0)
        slotsTableView.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.right.equalToSuperview()
            make.top.equalTo(headerView.snp.bottom)
            make.bottom.equalToSuperview()
        }
        slotsTableView.register(SlotTableViewCell.self, forCellReuseIdentifier: "slotsCell")
        
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
        slotsQuery = FIRDatabase.database().reference().child("accounts/\(user.uid)/slots")
            .queryOrdered(byChild: "endAt")
            .queryStarting(atValue: Date().timeIntervalSince1970)
            .queryLimited(toFirst: 10)
        
        slotsDatasource = slotsTableView.bind(to: slotsQuery!, populateCell: { (tableView, indexPath, snapshot) -> UITableViewCell in
            let cell = tableView.dequeueReusableCell(withIdentifier: "slotsCell", for: indexPath)
            if let slot = Slot(snapshot: snapshot) {
                (cell as! SlotTableViewCell).slot = slot
            }
            return cell
        })
    }
    
    internal func bindProfile() {
        profileRef = FIRDatabase.database().reference().child("profiles/\(user.uid)")
        profileRef!.observe(.value, with: { [unowned self] (snapshot) in
            self.headerView.profile = Profile(snapshot: snapshot)
        })
    }
    
    internal func bindAccount() {
        accountRef = FIRDatabase.database().reference().child("accounts/\(user.uid)")
        accountRef!.observe(.value, with: { [unowned self] (snapshot) in
            self.account = Account(snapshot: snapshot)
            self.slotsTableView.reloadData()
        })
    }
    
    // MARK: UITableViewDelegate

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 75
    }
}
