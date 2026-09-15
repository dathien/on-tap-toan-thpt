export type Semester = 1 | 2 | 'NEEDS_CURRICULUM_MAPPING';

export interface Lesson {
  id: string;
  name: string;
  semester: Semester;
}

export interface Topic {
  id: string;
  name: string;
  semester: Semester;
  lessons: Lesson[];
}

export const curriculumData: Record<number, Topic[]> = {
  "10": [
    {
      "id": "c1",
      "name": "Mệnh đề và tập hợp",
      "lessons": [
        {
          "id": "l1",
          "name": "Mệnh đề",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l2",
          "name": "Tập hợp",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l3",
          "name": "Các phép toán trên tập hợp",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        }
      ],
      "semester": "NEEDS_CURRICULUM_MAPPING"
    },
    {
      "id": "c2",
      "name": "Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",
      "lessons": [
        {
          "id": "l4",
          "name": "Bất phương trình bậc nhất hai ẩn",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l5",
          "name": "Hệ bất phương trình bậc nhất hai ẩn",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        }
      ],
      "semester": "NEEDS_CURRICULUM_MAPPING"
    }
  ],
  "11": [
    {
      "id": "c3",
      "name": "Hàm số lượng giác và phương trình lượng giác",
      "lessons": [
        {
          "id": "l6",
          "name": "Góc lượng giác",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l7",
          "name": "Các phép biến đổi lượng giác",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l8",
          "name": "Hàm số lượng giác",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l9",
          "name": "Phương trình lượng giác cơ bản",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        }
      ],
      "semester": "NEEDS_CURRICULUM_MAPPING"
    },
    {
      "id": "c4",
      "name": "Dãy số. Cấp số cộng và cấp số nhân",
      "lessons": [
        {
          "id": "l10",
          "name": "Dãy số",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l11",
          "name": "Cấp số cộng",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l12",
          "name": "Cấp số nhân",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        }
      ],
      "semester": "NEEDS_CURRICULUM_MAPPING"
    }
  ],
  "12": [
    {
      "id": "c5",
      "name": "Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số",
      "lessons": [
        {
          "id": "l13",
          "name": "Sự đồng biến, nghịch biến của hàm số",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l14",
          "name": "Cực trị của hàm số",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l15",
          "name": "Giá trị lớn nhất và giá trị nhỏ nhất của hàm số",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l16",
          "name": "Đường tiệm cận",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l17",
          "name": "Khảo sát sự biến thiên và vẽ đồ thị của hàm số",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        }
      ],
      "semester": "NEEDS_CURRICULUM_MAPPING"
    },
    {
      "id": "c6",
      "name": "Phương pháp tọa độ trong không gian",
      "lessons": [
        {
          "id": "l18",
          "name": "Hệ tọa độ trong không gian",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l19",
          "name": "Biểu thức tọa độ của các phép toán vectơ",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l20",
          "name": "Phương trình mặt phẳng",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l21",
          "name": "Phương trình đường thẳng",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l22",
          "name": "Phương trình mặt cầu",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        }
      ],
      "semester": "NEEDS_CURRICULUM_MAPPING"
    },
    {
      "id": "c7",
      "name": "Nguyên hàm, Tích phân và Ứng dụng",
      "lessons": [
        {
          "id": "l23",
          "name": "Nguyên hàm",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l24",
          "name": "Tích phân",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        },
        {
          "id": "l25",
          "name": "Ứng dụng hình học của tích phân",
          "semester": "NEEDS_CURRICULUM_MAPPING"
        }
      ],
      "semester": "NEEDS_CURRICULUM_MAPPING"
    }
  ]
};
