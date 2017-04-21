//
//  HomeViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/18/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import AlamofireImage
import Firebase
import SnapKit
import UIKit

class HomeViewController: UIViewController {
    
    // UI
    var profileImageView:UIImageView!
    var usernameLabel:UILabel!
    
    // Internal Properties
    internal var user:FIRUser
    internal var oauthClient:OAuthClient
    internal var profileRef:FIRDatabaseReference?
    
    required init(user:FIRUser, oauthClient:OAuthClient) {
        self.user = user
        self.oauthClient = oauthClient
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Nav Bar
        navigationItem.title = "Hubbub"
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Logout", style: .plain, target: self, action: #selector(doLogout))
        
        // Profile Image
        profileImageView = UIImageView()
        profileImageView.backgroundColor = UIColor.lightGray
        view.addSubview(profileImageView)
        profileImageView.snp.makeConstraints { (make) in
            make.width.equalTo(150)
            make.height.equalTo(150)
            make.top.equalTo(topLayoutGuide.snp.bottom).offset(20)
            make.left.equalToSuperview().offset(20)
        }
        
        // Username
        usernameLabel = UILabel()
        usernameLabel.text = "Loading..."
        view.addSubview(usernameLabel)
        usernameLabel.snp.makeConstraints { (make) in
            make.top.equalTo(profileImageView.snp.top)
            make.left.equalTo(profileImageView.snp.right).offset(20)
        }
        
        profileRef = FIRDatabase.database().reference().child("profile").child(user.uid)
        profileRef!.observe(.value, with: { [unowned self] (snapshot) in
            let data = snapshot.value as? [String : AnyObject] ?? [:]
            if let photo = (data["photo"] as? String), let photoURL = URL(string: photo) {
                self.profileImageView.af_setImage(withURL: photoURL)
            }
            if let username = data["handle"] {
                self.usernameLabel.text = (username as! String)
            }
        })
    }
    
    deinit {
        if let ref = profileRef {
            ref.removeAllObservers()
        }
    }

    func doLogout() {
        try? FIRAuth.auth()?.signOut()
    }
}
