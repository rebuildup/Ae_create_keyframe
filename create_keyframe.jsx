(function () {
  var dialog = new Window("dialog", "キーフレーム生成");
  dialog.orientation = "column";
  dialog.spacing = 10;
  dialog.margins = 16;

  var intervalGroup = dialog.add("group");
  intervalGroup.add("statictext", undefined, "間隔:");
  var intervalEdit = intervalGroup.add("edittext", undefined, "10");
  intervalEdit.characters = 4;
  intervalGroup.add("statictext", undefined, "フレーム");

  var countGroup = dialog.add("group");
  countGroup.add("statictext", undefined, "数:");
  var countEdit = countGroup.add("edittext", undefined, "5");
  countEdit.characters = 4;

  var buttonGroup = dialog.add("group");
  var executeButton = buttonGroup.add("button", undefined, "実行");
  var cancelButton = buttonGroup.add("button", undefined, "キャンセル");

  executeButton.onClick = function () {
    var interval = parseInt(intervalEdit.text);
    var count = parseInt(countEdit.text);

    if (isNaN(interval) || interval <= 0 || isNaN(count) || count <= 0) {
      alert("正の数値を入力してください");
      return;
    }

    dialog.close();

    var comp = app.project.activeItem;
    var selectedProperties = comp.selectedProperties;

    if (selectedProperties.length === 0) {
      alert("プロパティを選択してください");
      return;
    }

    app.beginUndoGroup("キーフレーム生成");

    var startTime = comp.time;
    var frameRate = comp.frameRate;

    for (var i = 0; i < selectedProperties.length; i++) {
      var prop = selectedProperties[i];
      if (prop.canSetExpression) {
        for (var j = 0; j < count; j++) {
          var time = startTime + (j * interval) / frameRate;
          if (time <= comp.duration) {
            prop.setValueAtTime(time, prop.valueAtTime(time, false));
          }
        }
      }
    }

    app.endUndoGroup();
  };

  cancelButton.onClick = function () {
    dialog.close();
  };

  dialog.show();
})();
