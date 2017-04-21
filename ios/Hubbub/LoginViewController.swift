//
//  LoginViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 3/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import SnapKit
import UIKit

class LoginViewController: UIViewController {
    
    // UI
    var loginButton:UIButton!
    
    // Internal Properties
    internal var oauthClient:OAuthClient
    
    required init(oauthClient:OAuthClient) {
        self.oauthClient = oauthClient
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Nav Bar
        navigationItem.title = "Hubbub Login"
        
        // Login
        loginButton = UIButton(type: .system)
        loginButton.setTitle("Login to GitHub", for: .normal)
        loginButton.setTitle("Logging in...", for: .disabled)
        loginButton.addTarget(self, action: #selector(doLogin), for: UIControlEvents.touchUpInside)
        view.addSubview(loginButton)
        loginButton.snp.makeConstraints { (make) -> Void in
            make.center.equalToSuperview()
        }
    }
    
    func doLogin() {
        oauthClient.authorize(from: self, callback: { [unowned self] (accessToken, error) in
            if (error != nil) {
                print("OAuth was cancelled or failed: \(error)")
                return
            }
            
            print("OAuth successful: access_token=\(accessToken!)")
            self.loginButton.isEnabled = false
            self.firebaseSignIn(accessToken: accessToken!)
        })
    }
    
    func firebaseSignIn(accessToken: String) {
        let credential = FIRGitHubAuthProvider.credential(withToken: accessToken)
        FIRAuth.auth()?.signIn(with: credential) { (user, error) in
            if (error != nil) {
                print("Firebase Auth error: \(error)")
                return
            }
        }
    }
}
