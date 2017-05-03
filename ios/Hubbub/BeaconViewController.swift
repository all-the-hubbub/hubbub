//
//  BeaconViewController.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 5/2/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import MaterialComponents
import SnapKit
import UIKit
import WebKit

class BeaconViewController: UIViewController {

    // UI
    let appBar = MDCAppBar()
    
    // Properties
    var slot: Slot
    
    required init(slot: Slot) {
        self.slot = slot
        super.init(nibName: nil, bundle: nil)
        addChildViewController(appBar.headerViewController)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        appBar.addSubviewsToParent()
        appBar.headerViewController.headerView.backgroundColor = ColorPrimary
        appBar.navigationBar.titleTextAttributes = [
            NSForegroundColorAttributeName: UIColor.white
        ]
        if let navShadowLayer = appBar.headerViewController.headerView.shadowLayer as? MDCShadowLayer {
            navShadowLayer.elevation = 3
        }
        
        // Nav Bar
        navigationItem.title = "Find your group"
        navigationItem.leftBarButtonItem = UIBarButtonItem(
            image: #imageLiteral(resourceName: "ic_arrow_back_white"),
            style: .done,
            target: self,
            action: #selector(back)
        )
        
        // WebView
        let webView = WKWebView(frame: .zero, configuration: WKWebViewConfiguration())
        view.addSubview(webView)
        webView.snp.makeConstraints { (make) in
            make.left.equalToSuperview()
            make.right.equalToSuperview()
            make.top.equalTo(appBar.headerViewController.headerView.snp.bottom)
            make.bottom.equalToSuperview()
        }
        
        // Load the beacon page
        if let topic = slot.topic, let url = URL(string: "https://hubbub-159904.firebaseapp.com/beacon/\(slot.id)/\(topic.id)") {
            webView.load(URLRequest(url: url))
        }
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    // MARK: Internal
    
    internal func back() {
        _ = navigationController?.popViewController(animated: true)
    }
}
