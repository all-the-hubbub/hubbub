//
//  AccountSlotTableViewCell.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import SnapKit
import UIKit

class TopicTag: UIView {
    let nameLabel = UILabel()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = #colorLiteral(red: 0.8588235294, green: 0.8588235294, blue: 0.8588235294, alpha: 1)
        layer.cornerRadius = 3
        
        nameLabel.textColor = #colorLiteral(red: 0.4274509804, green: 0.4274509804, blue: 0.4274509804, alpha: 1)
        nameLabel.font = UIFont.boldSystemFont(ofSize: 12)
        addSubview(nameLabel)
        nameLabel.snp.makeConstraints { (make) in
            make.left.equalToSuperview().offset(10)
            make.right.equalToSuperview().offset(-10)
            make.top.equalToSuperview().offset(4)
            make.bottom.equalToSuperview().offset(-4)
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

class AccountSlotTableViewCell: SlotTableViewCell {
    
    // UI
    let topicTag = TopicTag()
    let pendingLabel = UILabel()
    
    // Properties
    override var slot: Slot? {
        get {
            return super.slot
        }
        set {
            super.slot = newValue
            
            if let topic = slot?.topic {
                pendingLabel.isHidden = true
                topicTag.isHidden = false
                topicTag.nameLabel.text = topic.name
            } else {
                pendingLabel.isHidden = false
                topicTag.isHidden = true
            }
        }
    }
    
    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        pendingLabel.text = "pending..."
        pendingLabel.font = UIFont.italicSystemFont(ofSize: 12)
        pendingLabel.textColor = .darkGray
        addSubview(pendingLabel)
        pendingLabel.snp.makeConstraints { (make) in
            make.right.equalToSuperview().offset(-20)
            make.centerY.equalToSuperview()
        }
        
        addSubview(topicTag)
        topicTag.snp.makeConstraints { (make) in
            make.right.equalToSuperview().offset(-20)
            make.centerY.equalToSuperview()
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
