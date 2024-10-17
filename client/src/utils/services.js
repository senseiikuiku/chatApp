// Địa chỉ cơ bản cho API. Tất cả các yêu cầu sẽ được gửi đến địa chỉ này.
export const baseUrl = "http://localhost:5000/api";
// export const baseUrl = "https://chatapp-lxyo.onrender.com/api";

// Hàm postRequest thực hiện một yêu cầu HTTP POST đến một URL nhất định.
// Nó nhận vào hai tham số: url (địa chỉ API) và body (dữ liệu gửi đi).
export const postRequest = async (url, body) => {
   // Thực hiện yêu cầu fetch đến URL với phương thức POST.
   const response = await fetch(url, {
      method: "POST",
      headers: {
         "Content-Type": "application/json", // Định dạng dữ liệu là JSON.
      },
      body, // Dữ liệu sẽ được gửi trong thân yêu cầu.
   });

   // Chờ và lấy dữ liệu trả về từ server.
   const data = await response.json();

   // Kiểm tra nếu yêu cầu không thành công (response.ok = false).
   if (!response.ok) {
      let message; // Khởi tạo biến message để lưu thông báo lỗi.
      // Nếu có thông báo trong data, sử dụng nó. Ngược lại, sử dụng data như một thông báo.
      if (data?.message) {
         message = data.message;
      } else {
         message = data;
      }
      // Trả về một đối tượng với thuộc tính error và message.
      return { error: true, message };
   }
   // Nếu yêu cầu thành công, trả về dữ liệu đã nhận từ server.
   return data;
};

// Hàm getRequest thực hiện yêu cầu HTTP GET đến một URL nhất định.
export const getRequest = async (url) => {
   const response = await fetch(url);

   // Chờ và gọi json() để lấy dữ liệu từ server.
   const data = await response.json();

   // Kiểm tra nếu yêu cầu không thành công.
   if (!response.ok) {
      let message = "An error occurred...";

      // Nếu server gửi thông báo lỗi, lấy thông báo từ data.
      if (data?.message) {
         message = data.message;
      }

      // Trả về đối tượng lỗi.
      return {
         error: true,
         message,
      };
   }

   // Trả về dữ liệu nhận được từ server.
   return data;
};
