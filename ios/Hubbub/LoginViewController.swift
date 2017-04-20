//
//  LoginViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 3/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import UIKit


class LoginViewController: UIViewController {
    
    @IBOutlet weak var loginButton:UIButton!
    
    var oauthClient:OAuthClient?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        loginButton.addTarget(self, action: #selector(doLogin), for: UIControlEvents.touchUpInside)
        loginButton.setTitle("Logging in...", for: .disabled)
    }
    
    func doLogin() {
        oauthClient?.authorize(from: self, callback: { (accessToken, error) in
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
