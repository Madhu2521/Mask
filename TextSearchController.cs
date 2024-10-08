using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Http;

namespace TextFinderAndMaskingTool.Controllers
{
    [RoutePrefix("api/TextSearch")]
    public class TextSearchController : ApiController
    {
        // POST api/TextSearch/Search
        [HttpPost]
        [Route("Search")]
        public IHttpActionResult Search(SearchRequestModel model)
        {
            // Directory where files are stored
            var directoryPath = @"C:\Your\Directory\Path";
            var files = Directory.GetFiles(directoryPath, "*.*", SearchOption.AllDirectories);
            var resultList = new List<FileSearchResult>();

            foreach (var file in files)
            {
                var fileContent = File.ReadAllText(file);
                var occurrences = fileContent.Split(new[] { model.SearchText }, System.StringSplitOptions.None).Length - 1;

                if (occurrences > 0)
                {
                    resultList.Add(new FileSearchResult
                    {
                        FileName = Path.GetFileName(file),
                        Occurrences = occurrences
                    });
                }
            }

            if (!resultList.Any())
            {
                return Ok(new { message = "No file found with entered search criteria", isError = true });
            }

            return Ok(resultList);
        }

        // POST api/TextSearch/Mask
        [HttpPost]
        [Route("Mask")]
        public IHttpActionResult Mask(MaskRequestModel model)
        {
            foreach (var file in model.SelectedFiles)
            {
                var filePath = Path.Combine(@"C:\Your\Directory\Path", file);
                var fileContent = File.ReadAllText(filePath);
                var newContent = fileContent.Replace(model.SearchText, model.MaskText);
                File.WriteAllText(filePath, newContent);
            }

            return Ok(new { message = "Changes have been saved successfully" });
        }
    }
}
