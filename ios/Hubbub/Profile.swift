//
//  Profile.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/28/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import Foundation

class Profile: NSObject {
    var userID:String
    var name:String?
    var handle:String?
    var photoURL:URL?
    
    init?(snapshot:FIRDataSnapshot) {
        guard let data = (snapshot.value as? [String:Any]) else { return nil }
        
        self.userID = snapshot.key
        self.name = data["name"] as? String
        self.handle = data["handle"] as? String
        if let photo = data["photo"] as? String {
            self.photoURL = URL(string: photo)
        }
    }
}
