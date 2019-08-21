/* eslint-disable no-var */
void function(io, document) {
  document.addEventListener('DOMContentLoaded', ready);

  function ready() {
    var elName = document.getElementById('name');
    var elDistance = document.getElementById('distance');
    var elHours = document.getElementById('hours');

    var socket = io('/boarding');
    socket.on('traveler', function(e) {
      elName.innerText = e.fullName;
      elDistance.innerText = e.statistics.distance;
      elHours.innerText = e.statistics.hours;
    });
    // todo: clear after minute
  }
// eslint-disable-next-line no-undef
}(io, document);
