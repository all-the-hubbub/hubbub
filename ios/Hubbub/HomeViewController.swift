//
//  HomeViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/18/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import UIKit

class HomeViewController: UIViewController {
    
    var user:FIRUser?
    var oauthClient:OAuthClient?
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Logout Action
        self.navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(doLogout))
    }

    func doLogout() {
        try? FIRAuth.auth()?.signOut()
    }
}
