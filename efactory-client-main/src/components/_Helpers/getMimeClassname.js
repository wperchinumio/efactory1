const classIconNameFuc = mime => {
    var classIconName = ""
    switch (mime) {
      case "application/pdf":
        classIconName = "fa fa-file-pdf-o font-red-soft";
        break;
      case "application/excel":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        classIconName = "fa fa-file-excel-o font-green-jungle";
        break;
      case "application/x-msg":
        classIconName = "fa fa-envelope-o font-yellow";
        break;
      case "application/word":
        classIconName = "fa fa-file-word-o font-blue-soft";
        break;
      case "image/jpeg":
      case "image/png":
      case "image/bmp":
      case "image/gif":
        classIconName = "fa fa-file-image-o font-green-soft";
        break;
      case "text/plain":
        classIconName = "fa fa-file-text font-grey-mint";
        break;
      case "video/mp4":
        classIconName = "fa fa-file-video-o font-blue-steel";
        break;
        case "text/html":
        case "text/htm":
        case "text/xml":
        classIconName = "fa fa-file-code-o font-blue-madison";
          break;
        case "application/x-zip-compressed":
          classIconName = "fa fa-file-zip-o font-yellow-crusta";
          break;
        case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        classIconName = "fa fa-file-word-o font-blue-soft"; // todo replace the classname
        break;
      default:
        classIconName = "fa fa-file-o";
    }
    return classIconName
}

export default classIconNameFuc