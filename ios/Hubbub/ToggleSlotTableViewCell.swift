//
//  ToggleSlotTableViewCell.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import SnapKit
import UIKit

class CheckBox: UIButton {
    
    let checkedImage = #imageLiteral(resourceName: "ic_check_box").withRenderingMode(.alwaysTemplate)
    let uncheckedImage = #imageLiteral(resourceName: "ic_check_box_outline_blank").withRenderingMode(.alwaysTemplate)
    
    var isChecked: Bool {
        didSet {
            updateImage()
        }
    }
    
    override init(frame: CGRect) {
        isChecked = false
        super.init(frame: frame)
        self.tintColor = ColorSecondary
        updateImage()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    func updateImage() {
        if (isChecked) {
            setImage(checkedImage, for: .normal)
        } else {
            setImage(uncheckedImage, for: .normal)
        }
    }
}

protocol ToggleSlotTableViewCellDelegate: class {
    func toggleSlotTableViewCell(_ cell: ToggleSlotTableViewCell, didSetToggleTo value:Bool)
}

class ToggleSlotTableViewCell: SlotTableViewCell {

    // UI
    let checkBox = CheckBox()
    let spinner = UIActivityIndicatorView(activityIndicatorStyle: .gray)
    
    // Properties
    weak var delegate: ToggleSlotTableViewCellDelegate?
    
    override init(style: UITableViewCellStyle, reuseIdentifier: String?) {
        super.init(style: style, reuseIdentifier: reuseIdentifier)
        
        contentView.addSubview(checkBox)
        checkBox.snp.makeConstraints { (make) in
            make.right.equalToSuperview().offset(-20)
            make.centerY.equalToSuperview()
        }
        checkBox.addTarget(self, action: #selector(toggle), for: .touchUpInside)
        
        contentView.addSubview(spinner)
        spinner.snp.makeConstraints { (make) in
            make.center.equalTo(checkBox.snp.center)
        }
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func prepareForReuse() {
        spinner.stopAnimating()
        checkBox.isHidden = false
        super.prepareForReuse()
    }
    
    internal func toggle() {
        spinner.startAnimating()
        checkBox.isHidden = true
        delegate?.toggleSlotTableViewCell(self, didSetToggleTo: !checkBox.isChecked)
    }
}
