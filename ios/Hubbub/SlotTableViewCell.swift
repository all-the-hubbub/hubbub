//
//  SlotTableViewCell.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import SnapKit
import UIKit

class DateView: UIView {
    
    let numberLabel = UILabel()
    lazy var numberFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "dd"
        return f
    }()
    
    let weekdayLabel = UILabel()
    lazy var weekdayFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "EEE"
        return f
    }()
    
    var date: Date? {
        didSet{
            if date == nil {
                numberLabel.text = "00"
                weekdayLabel.text = "---"
            } else {
                numberLabel.text = numberFormatter.string(from: date!)
                weekdayLabel.text = weekdayFormatter.string(from: date!)
            }
        }
    }
    
    init() {
        super.init(frame: .zero)
        
        numberLabel.font = UIFont.boldSystemFont(ofSize: 18)
        numberLabel.textAlignment = .center
        numberLabel.textColor = ColorSecondary
        addSubview(numberLabel)
        numberLabel.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.right.equalToSuperview()
            make.top.equalToSuperview()
        }
        
        weekdayLabel.font = UIFont.systemFont(ofSize: 12)
        weekdayLabel.textAlignment = .center
        weekdayLabel.textColor = ColorSecondary
        addSubview(weekdayLabel)
        weekdayLabel.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.right.equalToSuperview()
            make.top.equalTo(numberLabel.snp.bottom)
            make.bottom.equalToSuperview()
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

class SlotTableViewCell: UITableViewCell {
    
    let dateView = DateView()
    let nameLabel = UILabel()
    let descriptionLabel = UILabel()
    
    lazy var timeFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "h:mm a"
        return f
    }()
    
    var slot:Slot? {
        didSet {
            dateView.date = slot?.startDate
            nameLabel.text = slot?.name
            
            var desc = ""
            if let date = slot?.startDate {
                desc = timeFormatter.string(from: date)
            }
            if let loc = slot?.location {
                if (desc != "") {
                    desc += " • "
                }
                desc += loc
            }
            descriptionLabel.text = desc
        }
    }
    
    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        backgroundColor = .white
        
        contentView.addSubview(dateView)
        dateView.snp.makeConstraints { (make) in
            make.width.equalTo(30)
            make.left.equalToSuperview().offset(20)
            make.centerY.equalToSuperview()
        }
        
        nameLabel.font = UIFont.boldSystemFont(ofSize: 16)
        contentView.addSubview(nameLabel)
        nameLabel.snp.makeConstraints { (make) in
            make.left.equalTo(dateView.snp.right).offset(20)
            make.top.equalTo(dateView.snp.top)
        }
        
        descriptionLabel.font = UIFont.systemFont(ofSize: 12)
        descriptionLabel.textColor = .darkGray
        contentView.addSubview(descriptionLabel)
        descriptionLabel.snp.makeConstraints { (make) in
            make.left.equalTo(nameLabel.snp.left)
            make.top.equalTo(nameLabel.snp.bottom).offset(2)
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
