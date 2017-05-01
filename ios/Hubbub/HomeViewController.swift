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
    let slotsTableView:UITableView = UITableView(frame: .zero, style: .plain)
    
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
        slotsTableView.allowsSelection = false
        slotsTableView.backgroundColor = #colorLiteral(red: 0.9333333333, green: 0.9333333333, blue: 0.9333333333, alpha: 1)
        slotsTableView.delegate = self
        view.insertSubview(slotsTableView, at: 0)
        slotsTableView.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.right.equalToSuperview()
            make.top.equalTo(headerView.snp.bottom)
            make.bottom.equalToSuperview()
        }
        slotsTableView.register(AccountSlotTableViewCell.self, forCellReuseIdentifier: "slotsCell")
        
        // Join Button
        let joinButton = MDCFloatingButton(shape: .default)
        joinButton.setTitle("+", for: .normal)
        joinButton.addTarget(self, action: #selector(presentSlots), for: .touchUpInside)
        view.addSubview(joinButton)
        joinButton.snp.makeConstraints { (make) in
            make.right.equalToSuperview().offset(-20)
            make.bottom.equalToSuperview().offset(-20)
        }
        
        bindSlots()
        bindProfile()
    }
    
    deinit {
        if let ref = profileRef {
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
    
    internal func presentSlots() {
        let slotsVC = SlotsViewController(user: user)
        navigationController?.pushViewController(slotsVC, animated: true)
    }
    
    internal func doLogout() {
        try? FIRAuth.auth()?.signOut()
    }
    
    internal func bindSlots() {
        // Fetch the next 10 slots this user has joined
        slotsQuery = FIRDatabase.database().reference().child("accounts/\(user.uid)/slots")
            .queryOrdered(byChild: "endAt")
            .queryStarting(atValue: Date().timeIntervalSince1970)
            .queryLimited(toFirst: 10)
        
        slotsDatasource = slotsTableView.bind(to: slotsQuery!, populateCell: { (tableView, indexPath, snapshot) -> UITableViewCell in
            let cell = tableView.dequeueReusableCell(withIdentifier: "slotsCell", for: indexPath)
            if let slot = Slot(snapshot: snapshot) {
                (cell as! AccountSlotTableViewCell).slot = slot
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
    
    // MARK: UITableViewDelegate

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 75
    }
}
