function calcTreeNounces(plotNounces,ramNounces) {
    var treesInFlie = Math.ceil(plotNounces / ramNounces);
    while ( (plotNounces % treesInFlie) > 0 ) {
      treesInFlie++;      
    }
    return plotNounces / treesInFlie;    
}

$(document).ready(function(){
  $("#config-form").submit(function(){
    $("#result").empty();
    var plotSize = parseFloat($("#plot-size").val())*1024*1024;
    var maxRam = parseFloat($("#max-ram").val())*1024*1024;
    var diskSpace = Math.floor(parseFloat($("#disk-space").val())/1024);
    var startNounce = parseInt($("#start-nounce").val());
    var plotsPath = $("#plots-path").val();
    var walletId = parseInt($("#wallet-id").val());

    $("#result").append("plotSize = "+plotSize+" KB\n");
    $("#result").append("maxRam = "+maxRam+" KB\n");
    $("#result").append("diskSpace = "+diskSpace+" KB\n");
    $("#result").append("startNounce = "+startNounce+"\n");
    $("#result").append("walletId = "+walletId+"\n");
    
    $("#result").append("------------------------\n");
    
    var plotNounces = Math.floor(plotSize / 256);
    var ramNounces = Math.floor(maxRam / 256);
    var fileCount = Math.floor(diskSpace / (plotNounces * 256));    
    var treeNounces = calcTreeNounces(plotNounces,ramNounces);
    $("#result").append("plotNounces = "+plotNounces+"\n");
    $("#result").append("ramNounces = "+ramNounces+"\n");
    $("#result").append("fileCount = "+fileCount+"\n");    
    $("#result").append("treeNounces = "+treeNounces+"\n");
    
    $("#result").append("------------------------\n");
    var lastDiskSpace = diskSpace - (fileCount * plotNounces * 256);
    var lastPlotNounces = Math.floor(lastDiskSpace / 256);
    var lastTreeNounces = 0;
    if (lastPlotNounces > 0) {
      lastTreeNounces = calcTreeNounces(lastPlotNounces,ramNounces);
    }
    $("#result").append("lastPlotNounces = "+plotNounces+"\n");
    $("#result").append("lastTreeNounces = "+lastTreeNounces+"\n");    

    $("#result").append("------------------------\n");
    
    var curStart = startNounce;
    for (var i = 1; i <= fileCount; i++) {
      var cmd = "gpuPlotGenerator generate buffer "+plotsPath+walletId+"_"+curStart+"_"+plotNounces+"_"+treeNounces+"\n";
      $("#result").append(cmd);
      curStart += plotNounces;
    }
    if (lastPlotNounces > 0) {
      var cmd = "gpuPlotGenerator generate buffer "+plotsPath+walletId+"_"+curStart+"_"+lastPlotNounces+"_"+lastTreeNounces+"\n";
      $("#result").append(cmd);
      curStart += plotNounces;
    }    
    
    $("#result").append("rem next plot start at "+curStart+"\n");
    
    return false;
  });
});