//
//  Account.swift
//  Hubbub
//
//  Created by Justin Rosenthal on 4/25/17.
//  Copyright © 2017 All The Hubbub. All rights reserved.
//

import Firebase
import Foundation

class Account: NSObject {
    var userID:String
    var token:String?
    var slots:[Slot]
    
    init?(snapshot:FIRDataSnapshot) {
        guard let data = (snapshot.value as? [String:Any]) else { return nil }
        
        self.userID = snapshot.key
        self.token = data["token"] as? String
        self.slots = [Slot]()
        
        if let slots = data["slots"] as? [String: [String:Any]] {
            for (key, data) in slots {
                if let slot = Slot(key: key, data: data) {
                    self.slots.append(slot)
                }
            }
        }
    }
    
    func hasRequestForSlot(id:String) -> Bool {
        for slot in slots {
            if slot.id == id {
                return true
            }
        }
        return false
    }
}
