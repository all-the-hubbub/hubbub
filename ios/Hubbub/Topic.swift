//
//  Topic.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/30/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Foundation

class Topic: NSObject {
    
    var id:String
    var name:String?
    
    init?(data:[String:Any]) {
        guard let id = data["id"] as? String else { return nil }
        guard let name = data["name"] as? String else { return nil }
        
        self.id = id
        self.name = name
    }
}
