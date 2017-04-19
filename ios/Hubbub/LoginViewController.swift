//
//  LoginViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 3/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import p2_OAuth2
import UIKit


let OAUTH_REDIRECT_URL = "https://hubbub-159904.firebaseapp.com/assets/oauth.html"


class LoginViewController: UIViewController {
    
    @IBOutlet weak var loginButton:UIButton!
    
    var oauth2 = OAuth2CodeGrant(settings: [
        "client_id": "077cb2f4568e245a97eb",
        "client_secret": "aa4b736a317532b47202cb7c9820bba587e64a70",
        "authorize_uri": "https://github.com/login/oauth/authorize",
        "token_uri": "https://github.com/login/oauth/access_token",
        "scope": "public_repo,user:email",
        "redirect_uris": [OAUTH_REDIRECT_URL],
        "secret_in_body": true,
        "verbose": true,
        "keychain": false,
    ] as OAuth2JSON)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        loginButton.addTarget(self, action: #selector(doLogin), for: UIControlEvents.touchUpInside)
        loginButton.setTitle("Logging in...", for: .disabled)
    }
    
    func doLogin() {
        // Tell the AppDelegate that hubbub:// urls should be handled by us at the moment
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.oauthCallback = { (url) in
            // The OAuth2 library has a strange requirement that the URL passed to handleRedirectURL() have the same base
            // as the URL specified in "redirect_uris" setting. In our case they're different, so we need to trick the library
            // by crafting a URL that will validate while making sure to pass through the query params.
            if let redirectURL = URL(string: OAUTH_REDIRECT_URL + "?" + url.query!) {
                self.oauth2.handleRedirectURL(redirectURL)
            }
        }
        
        // Begin OAuth flow
        oauth2.authorizeEmbedded(from: self) { authParameters, error in
            // Always cleanup the AppDelegate
            appDelegate.oauthCallback = nil
            
            if (error != nil) {
                print("OAuth was cancelled or failed: \(error)")
                return
            }
            
            print("OAuth successful: \(authParameters!)")
            self.loginButton.isEnabled = false
            self.firebaseSignIn(accessToken: self.oauth2.accessToken!)
        }
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
