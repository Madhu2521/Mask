namespace TextFinderAndMaskingTool.Models
{
    public class MaskRequestModel
    {
        public string SearchText { get; set; }
        public string MaskText { get; set; }
        public List<string> SelectedFiles { get; set; }
    }
}
