//
//  Slot.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/25/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import Foundation

class Slot: NSObject {
    
    var id:String
    var name:String?
    var timestamp:Int?
    var topicID:String?
    
    var date:Date {
        get {
            let interval = TimeInterval(self.timestamp ?? 0)
            return Date(timeIntervalSince1970: interval)
        }
    }
    
    init?(key:String, data:[String:Any]) {
        self.id = key
        self.name = data["name"] as? String
        self.timestamp = data["timestamp"] as? Int
        self.topicID = data["topicId"] as? String
    }
    
    convenience init?(snapshot:FIRDataSnapshot) {
        guard let data = snapshot.value as? [String:Any] else { return nil }
        self.init(key: snapshot.key, data: data)
    }
}
