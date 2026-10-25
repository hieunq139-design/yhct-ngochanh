// Số Zalo nhận lịch hẹn
const ZALO_PHONE = "0916752003";

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("booking-form");
const status = form.querySelector(".form-status");
const dateInput = form.elements.date;

// Không cho chọn ngày đã qua
dateInput.min = new Date().toLocaleDateString("en-CA");

function formatDate(value) {
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

function showStatus(text, isError) {
  status.textContent = text;
  status.classList.toggle("error", Boolean(isError));
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Trình duyệt cũ: dùng textarea tạm
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value.trim();
  const date = dateInput.value;
  const session = form.elements.session.value;
  const note = form.elements.note.value.trim();

  const missing = [];
  [["name", name], ["phone", phone], ["date", date]].forEach(([field, value]) => {
    form.elements[field].setAttribute("aria-invalid", value ? "false" : "true");
    if (!value) missing.push(field);
  });
  if (!/^[0-9+\s.]{9,15}$/.test(phone) && phone) {
    form.elements.phone.setAttribute("aria-invalid", "true");
    showStatus("Số điện thoại chưa đúng, bạn kiểm tra lại giúp nhé.", true);
    return;
  }
  if (missing.length) {
    form.elements[missing[0]].focus();
    showStatus("Vui lòng điền họ tên, số điện thoại và ngày muốn đến.", true);
    return;
  }

  const message = [
    "Chào Phòng chẩn trị Ngọc Hạnh, tôi muốn đặt lịch khám:",
    `- Họ tên: ${name}`,
    `- SĐT: ${phone}`,
    `- Thời gian: ${session}, ngày ${formatDate(date)}`,
    note ? `- Triệu chứng/nhu cầu: ${note}` : null,
  ].filter(Boolean).join("\n");

  const copied = await copyText(message);
  window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank", "noopener");

  showStatus(
    copied
      ? "Đã chép sẵn tin nhắn. Khi Zalo mở ra, bạn dán (giữ ô chat → Dán) và bấm Gửi nhé."
      : "Zalo đang mở. Bạn vui lòng nhắn họ tên, SĐT và giờ muốn đến cho phòng chẩn trị nhé.",
    false
  );
});
