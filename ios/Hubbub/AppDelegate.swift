//
//  AppDelegate.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 3/28/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    var oauthCallback: ((URL) -> Void)?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        let rootViewController = UINavigationController()
        
        // Initialize Firebase
        FIRApp.configure()
        
        // Handle auth state changes:
        // If not logged in, show the login screen. Otherwise show the home screen.
        FIRAuth.auth()?.addStateDidChangeListener({ (auth, user) in
            let ident:String = (user == nil) ? "LoginViewController" : "HomeViewController"
            let storyboard = UIStoryboard(name: "Main", bundle: nil)
            let vc = storyboard.instantiateViewController(withIdentifier: ident)
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
            self.oauthCallback?(url)
            return true
        }
        return false
    }
}

