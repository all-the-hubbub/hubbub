//
//  AccountSlotTableViewCell.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import UIKit

class TopicTag: UILabel {
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        textColor = ColorSecondary
        backgroundColor = #colorLiteral(red: 0.9058823529, green: 0.9647058824, blue: 0.9764705882, alpha: 1)
        
        textAlignment = .center
        font = UIFont.boldSystemFont(ofSize: 12)
        
        clipsToBounds = true
        layer.cornerRadius = 3
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func sizeThatFits(_ size: CGSize) -> CGSize {
        let superSize = super.sizeThatFits(size)
        return CGSize(width: superSize.width + (2 * 10), height: superSize.height + (2 * 4))
    }
}

class AccountSlotTableViewCell: SlotTableViewCell {
    
    // UI
    let topicTag = TopicTag()
    let pendingLabel: UILabel = {
        let l = UILabel()
        l.text = "pending..."
        l.font = UIFont.italicSystemFont(ofSize: 12)
        l.textColor = .darkGray
        l.sizeToFit()
        return l
    }()
    
    // Properties
    override var slot: Slot? {
        get {
            return super.slot
        }
        set {
            super.slot = newValue
            
            if let topic = slot?.topic {
                topicTag.text = topic.name
                topicTag.sizeToFit()
                self.accessoryView = topicTag
            } else {
                self.accessoryView = pendingLabel
            }
        }
    }
}
