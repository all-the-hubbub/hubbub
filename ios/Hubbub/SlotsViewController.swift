//
//  SlotsViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Alamofire
import Firebase
import MaterialComponents
import SnapKit
import UIKit

class SlotsViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, ToggleSlotTableViewCellDelegate {

    // UI
    let appBar = MDCAppBar()
    let slotsTableView:UITableView = UITableView(frame: .zero, style: .plain)

    // Properties
    var user:FIRUser
    
    // Internal Properties
    internal var slots:[Slot] = [Slot]()
    internal var accountSlotIds:Set<String> = Set<String>()
    
    // Database
    internal var slotsQuery:FIRDatabaseQuery?
    internal var accountSlotsQuery:FIRDatabaseQuery?
    internal var accountSlotsHandles = [UInt]()
    
    required init(user:FIRUser) {
        self.user = user
        super.init(nibName: nil, bundle: nil)
        addChildViewController(appBar.headerViewController)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    deinit {
        if let query = accountSlotsQuery {
            for handle in accountSlotsHandles {
                query.removeObserver(withHandle: handle)
            }
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        appBar.addSubviewsToParent()
        appBar.headerViewController.headerView.backgroundColor = ColorPrimary
        appBar.navigationBar.titleTextAttributes = [
            NSForegroundColorAttributeName: UIColor.white
        ]
        if let navShadowLayer = appBar.headerViewController.headerView.shadowLayer as? MDCShadowLayer {
            navShadowLayer.elevation = 3
        }
        
        // Nav Bar
        navigationItem.title = "Join a meetup"
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            image: #imageLiteral(resourceName: "ic_arrow_back_white"),
            style: .done,
            target: self,
            action: #selector(back)
        )
        
        // Slots
        slotsTableView.delegate = self
        slotsTableView.dataSource = self
        slotsTableView.allowsSelection = false
        slotsTableView.backgroundColor = .white
        view.insertSubview(slotsTableView, at: 0)
        slotsTableView.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.right.equalToSuperview()
            make.top.equalTo(appBar.headerViewController.headerView.snp.bottom)
            make.bottom.equalToSuperview()
        }
        slotsTableView.register(ToggleSlotTableViewCell.self, forCellReuseIdentifier: "slotsCell")
        
        let now = Date().timeIntervalSince1970
        fetchSlots(startAt: now, limit: 10)
        bindAccountSlots(startAt: now, limit: 10)
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    // MARK: Internal
    
    internal func back() {
        _ = navigationController?.popViewController(animated: true)
    }
    
    internal func fetchSlots(startAt:TimeInterval, limit:UInt) {
        slotsQuery = FIRDatabase.database().reference(withPath: "slots")
            .queryOrdered(byChild: "startAt")
            .queryStarting(atValue: startAt)
            .queryLimited(toFirst: limit)
        
        slotsQuery!.observeSingleEvent(of: .value, with: { [weak self] (snapshot) in
            guard let strongSelf = self else { return }
            
            var newSlots = [Slot]()
            for child in snapshot.children {
                if let slotSnapshot = child as? FIRDataSnapshot, let slot = Slot(snapshot: slotSnapshot) {
                    if (slot.state == "open") {
                        newSlots.append(slot)
                    }
                }
            }
            
            strongSelf.slots = newSlots
            strongSelf.slotsTableView.reloadData()
        })
    }
    
    internal func bindAccountSlots(startAt:TimeInterval, limit:UInt) {
        accountSlotsQuery = FIRDatabase.database().reference(withPath: "accounts/\(user.uid)/slots")
            .queryOrdered(byChild: "startAt")
            .queryStarting(atValue: startAt)
            .queryLimited(toFirst: limit)
        
        var handle = accountSlotsQuery!.observe(.childAdded, with: { [weak self] (snapshot) in
            guard let strongSelf = self else { return }
            
            let id = snapshot.key
            strongSelf.accountSlotIds.insert(id)
            strongSelf.reloadCellFor(slotId: id)
        })
        accountSlotsHandles.append(handle)
        
        handle = accountSlotsQuery!.observe(.childRemoved, with: { [weak self] (snapshot) in
            guard let strongSelf = self else { return }
            
            let id = snapshot.key
            strongSelf.accountSlotIds.remove(id)
            strongSelf.reloadCellFor(slotId: id)
        })
        accountSlotsHandles.append(handle)
    }
    
    internal func reloadCellFor(slotId:String) {
        for (i, slot) in slots.enumerated() {
            if (slot.id == slotId) {
                let indexPath = IndexPath(row: i, section: 0)
                slotsTableView.reloadRows(at: [indexPath], with: .none)
                return
            }
        }
    }
    
    // MARK: UITableViewDataSource

    func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return slots.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "slotsCell", for: indexPath)
        if let toggleSlotCell = cell as? ToggleSlotTableViewCell {
            let slot = slots[indexPath.row]
            toggleSlotCell.delegate = self
            toggleSlotCell.slot = slot
            toggleSlotCell.checkBox.isChecked = self.accountSlotIds.contains(slot.id)
        }
        return cell
    }
    
    // MARK: UITableViewDelegate
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 75
    }
    
    // MARK: ToggleSlotTableViewCellDelegate
    
    func toggleSlotTableViewCell(_ cell: ToggleSlotTableViewCell, didSetToggleTo value: Bool) {
        guard let slotId = cell.slot?.id else { return }
        
        let params: Parameters = [
            "id": slotId,
            "userId": user.uid
        ]
        
        let call = value ? "joinSlot" : "leaveSlot"
        let url = "https://us-central1-hubbub-159904.cloudfunctions.net/\(call)"
        _ = Alamofire.request(url, method: .post, parameters: params, encoding: JSONEncoding.default)
    }
}
