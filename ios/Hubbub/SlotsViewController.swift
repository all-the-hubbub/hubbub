//
//  SlotsViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import FirebaseDatabaseUI
import MaterialComponents
import MaterialComponents.MaterialIcons_ic_arrow_back
import MaterialComponents.MaterialPalettes
import SnapKit
import UIKit

class SlotsViewController: UIViewController, UITableViewDelegate {

    // UI
    let appBar = MDCAppBar()
    let slotsTableView:UITableView = UITableView(frame: .zero, style: .plain)

    // Internal Properties
    internal var user:FIRUser
    internal var slotsQuery:FIRDatabaseQuery?
    internal var slotsDatasource:FUITableViewDataSource?
    internal var accountSlotIds:Set<String> = Set<String>()
    internal var accountSlotsQuery:FIRDatabaseQuery?
    
    required init(user:FIRUser) {
        self.user = user
        
        super.init(nibName: nil, bundle: nil)
        
        addChildViewController(appBar.headerViewController)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    deinit {
        if let query = slotsQuery {
            query.removeAllObservers()
        }
        if let query = accountSlotsQuery {
            query.removeAllObservers()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        appBar.addSubviewsToParent()
        appBar.headerViewController.headerView.backgroundColor = MDCPalette.blue().tint500
        if let navShadowLayer = appBar.headerViewController.headerView.shadowLayer as? MDCShadowLayer {
            navShadowLayer.elevation = 3
        }
        
        // Nav Bar
        navigationItem.title = "Join a meetup"
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            image: UIImage(named:MDCIcons.pathFor_ic_arrow_back()),
            style: .done,
            target: self,
            action: #selector(back)
        )
        
        // Slots
        slotsTableView.backgroundColor = #colorLiteral(red: 0.9333333333, green: 0.9333333333, blue: 0.9333333333, alpha: 1)
        slotsTableView.delegate = self
        view.insertSubview(slotsTableView, at: 0)
        slotsTableView.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.right.equalToSuperview()
            make.top.equalTo(appBar.headerViewController.headerView.snp.bottom)
            make.bottom.equalToSuperview()
        }
        slotsTableView.register(SlotTableViewCell.self, forCellReuseIdentifier: "slotsCell")
        
        let now = Date().timeIntervalSince1970
        bindSlots(startAt: now, limit: 10)
        bindAccountSlots(startAt: now, limit: 10)
    }
    
    // MARK: Internal
    
    internal func back() {
        _ = navigationController?.popViewController(animated: true)
    }
    
    internal func bindSlots(startAt:TimeInterval, limit:UInt) {
        slotsQuery = FIRDatabase.database().reference().child("slots")
            .queryOrdered(byChild: "startAt")
            .queryStarting(atValue: startAt)
            .queryLimited(toFirst: limit)
        
        slotsDatasource = slotsTableView.bind(to: slotsQuery!, populateCell: { [unowned self] (tableView, indexPath, snapshot) -> UITableViewCell in
            let cell = tableView.dequeueReusableCell(withIdentifier: "slotsCell", for: indexPath)
            if let slot = Slot(snapshot: snapshot), let slotCell = cell as? SlotTableViewCell {
                slotCell.slot = slot
                if (self.accountSlotIds.contains(slot.id)) {
                    slotCell.backgroundColor = .yellow
                }
            }
            return cell
        })
    }
    
    internal func bindAccountSlots(startAt:TimeInterval, limit:UInt) {
        accountSlotsQuery = FIRDatabase.database().reference().child("accounts/\(user.uid)/slots")
            .queryOrdered(byChild: "startAt")
            .queryStarting(atValue: startAt)
            .queryLimited(toFirst: limit)
        
        accountSlotsQuery?.observe(.childAdded, with: { [unowned self] (snapshot) in
            let id = snapshot.key
            self.accountSlotIds.insert(id)
            self.reloadCellFor(slotId: id)
        })
        accountSlotsQuery?.observe(.childRemoved, with: { [unowned self] (snapshot) in
            let id = snapshot.key
            self.accountSlotIds.remove(id)
            self.reloadCellFor(slotId: id)
        })
    }
    
    internal func reloadCellFor(slotId:String) {
        guard let count = slotsDatasource?.count else { return }
        for i in 0...Int(count) {
            if (slotsDatasource?.snapshot(at: i).key == slotId) {
                let indexPath = IndexPath(row: i, section: 0)
                slotsTableView.reloadRows(at: [indexPath], with: .none)
                return
            }
        }
    }
    
    // MARK: UITableViewDelegate
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 75
    }
}
