﻿using System.ComponentModel.DataAnnotations;

namespace Backend
{
    public class User
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }  
        public string Username { get; set; } = string.Empty;
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

    }
}
