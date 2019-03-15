/**
 * 
 * @param {*} value the slider input value
 * @param {*} targetDivLeft  the div on the left hand side
 * @param {*} targetDivRight the div on the right hand side
 * @param {*} iconWid  the icon width  // removed
 */
//var sliderOnInput = function (value, DivLeft, DivRight, iconWid) {
var sliderOnInput = function (value, DivLeft, DivRight, iconWid) {
    var containerWid = DivLeft.width();
    var position = (containerWid - iconWid * 2) * value / containerWid;

    var leftVal = position + iconWid * 100 / containerWid - 0.3;
    var rightVal = position + iconWid * 100 / containerWid + 0.3;
    DivLeft.css("clip-path", "polygon(0% 0%," + leftVal + "% 0%," + leftVal + "% 100%,0% 100%)");
    DivRight.css("clip-path", "polygon(" + rightVal + "% 0%,100% 0%,100% 100%," + rightVal + "% 100%)");
}