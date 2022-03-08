using System.ComponentModel.DataAnnotations;

namespace Backend
{
    public class UserDto // user data transfer object
    {
        [Key]
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

    }
}
