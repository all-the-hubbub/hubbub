//
//  AppDelegate.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 3/28/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import UIKit
import Fabric
import Crashlytics

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var user: FIRUser?
    let oauthClient = GitHubOAuthClient()

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        let rootViewController = UINavigationController()
        rootViewController.setNavigationBarHidden(true, animated: false)

        // Initialize Fabric
        Fabric.sharedSDK().debug = true
        Fabric.with([Crashlytics.self])

        // Initialize Firebase
        FIRApp.configure()
        FIRDatabase.setLoggingEnabled(true)

        // Firebase Auth
        FIRAuth.auth()?.addStateDidChangeListener({ [unowned self] (auth, user) in
            // If nothing has changed since the last invocation, return early.
            // This prevents ViewController thrashing in scenarios like a new access token being minted.
            if (user != nil && user!.uid == self.user?.uid) {
                return
            }
            self.user = user
        
            // If not logged in, show the login screen. Otherwise show the home screen.
            var vc:UIViewController
            if (self.user == nil) {
                vc = LoginViewController(oauthClient: self.oauthClient)
            } else {
                vc = HomeViewController(user: self.user!, oauthClient: self.oauthClient)
            }
            rootViewController.setViewControllers([vc], animated: false)
        })

        // Storyboard has no entry point, so create a Window ourselves
        window = UIWindow.init(frame: UIScreen.main.bounds)
        window!.backgroundColor = UIColor.white
        window!.rootViewController = rootViewController
        window!.makeKeyAndVisible()

        return true
    }

    func application(_ application: UIApplication, open url: URL, sourceApplication: String?, annotation: Any) -> Bool {
        if url.scheme == "hubbub" {
            self.oauthClient.handleRedirectURL(url)
            return true
        }
        return false
    }
}
