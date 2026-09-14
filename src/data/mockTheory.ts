import { VisualConfig } from '../types';

export const getMockTheory = (lessonName: string) => {
  return {
    title: lessonName,
    sections: [
      {
        id: 'kien-thuc',
        title: '① Kiến thức cần nhớ',
        content: `Khảo sát sự biến thiên và vẽ đồ thị của hàm số là một kỹ năng quan trọng. Hàm số $y = ax^3 + bx^2 + cx + d$ có đạo hàm $y' = 3ax^2 + 2bx + c$.`
      },
      {
        id: 'khai-niem',
        title: '② Khái niệm/định nghĩa',
        content: `Hàm số đồng biến trên $K$ nếu $\\forall x_1, x_2 \\in K, x_1 < x_2 \\Rightarrow f(x_1) < f(x_2)$.`
      },
      {
        id: 'cong-thuc',
        title: '③ Công thức quan trọng',
        content: `$$\\Delta' = b^2 - 3ac$$ Nếu $\\Delta' > 0$, hàm số có 2 điểm cực trị.`
      },
      {
        id: 'phuong-phap',
        title: '⑤ Quy trình hoặc phương pháp giải',
        content: `**Bước 1:** Tìm tập xác định.\n**Bước 2:** Tính $y'$. Tìm các nghiệm của $y' = 0$.\n**Bước 3:** Lập bảng biến thiên.\n**Bước 4:** Kết luận khoảng đơn điệu và cực trị.`
      },
      {
        id: 'vi-du',
        title: '⑥ Ví dụ mẫu (Bảng biến thiên)',
        content: `Khảo sát hàm số $y = x^3 - 3x + 2$. Ta có $y' = 3x^2 - 3$. $y' = 0 \\Leftrightarrow x = \\pm 1$.`,
        visual: {
          type: 'VARIATION_TABLE',
          data: {
            xPoints: [
              { type: "infinity", value: "-\\infty" },
              { type: "critical", value: "-1" },
              { type: "critical", value: "1" },
              { type: "infinity", value: "+\\infty" }
            ],
            derivative: {
              intervals: ["+", "-", "+"],
              criticalValues: ["0", "0"]
            },
            function: {
              intervalDirections: ["up", "down", "up"],
              pointValues: [
                { x: "-1", y: "4", type: "local_max" },
                { x: "1", y: "0", type: "local_min" }
              ],
              leftLimit: "-\\infty",
              rightLimit: "+\\infty"
            }
          }
        } as VisualConfig
      }
    ]
  }
};
