//
//  HomeSlotsTableHeaderView.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 5/1/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import UIKit

class HomeSlotsTableHeaderView: UIView {
    override init(frame: CGRect) {
        super.init(frame: frame)
        
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 14)
        label.textColor = .darkGray
        label.text = "Upcoming events"
        addSubview(label)
        label.snp.makeConstraints { (make) in
            make.left.equalToSuperview().offset(20)
            make.bottom.equalToSuperview().offset(-20)
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
