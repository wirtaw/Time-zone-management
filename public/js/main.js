const DateTime = luxon.DateTime;
const dt = DateTime.local();

const clientTime = document.getElementById('clientTimes');
if (clientTime) {
  clientTime.children[0].innerHTML = dt.toISO();
  clientTime.children[2].innerHTML = dt.offset;
  clientTime.children[4].innerHTML = dt.toMillis();
  clientTime.children[6].innerHTML = dt.zoneName;
}

const availalbleAtItems = document.querySelectorAll('.availalbleAt');

if (availalbleAtItems) {
  availalbleAtItems.forEach((availalbleAt) => {
    availalbleAt.innerHTML = toISO(Number(availalbleAt.getAttribute('attr-availalbleat')));
  });
}

function toISO(timestamp) {
  if (!timestamp) {
    return '';
  }

  return DateTime.fromMillis(timestamp).toISO();
}
