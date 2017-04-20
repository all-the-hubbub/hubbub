//
//  HomeViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/18/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import SnapKit
import UIKit

class HomeViewController: UIViewController {
    
    var user:FIRUser?
    var oauthClient:OAuthClient?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Nav Bar
        navigationItem.title = "Hubbub"
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(doLogout))
        
        // Placeholder
        let label = UILabel()
        label.text = "Logged in!"
        view.addSubview(label)
        label.snp.makeConstraints { (make) in
            make.center.equalToSuperview()
        }
    }

    func doLogout() {
        try? FIRAuth.auth()?.signOut()
    }
}
