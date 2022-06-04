namespace Backend.Models
{
    public class FileUploadRequest
    {
        public string FileName { get; set; }
        public string Username { get; set; }
        public Boolean publicData{ get; set; }
        public IFormFile csvFile { get; set; }

    }
}
