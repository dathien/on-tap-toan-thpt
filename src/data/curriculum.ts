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
                "id": "l10_1",
                "name": "Mệnh đề",
                "semester": 1
            },
            {
                "id": "l10_2",
                "name": "Tập hợp",
                "semester": 1
            },
            {
                "id": "l10_3",
                "name": "Các phép toán trên tập hợp",
                "semester": 1
            }
        ],
        "semester": 1
    },
    {
        "id": "c2",
        "name": "Bất phương trình và hệ bất phương trình bậc nhất hai ẩn",
        "lessons": [
            {
                "id": "l10_4",
                "name": "Bất phương trình bậc nhất hai ẩn",
                "semester": 1
            },
            {
                "id": "l10_5",
                "name": "Hệ bất phương trình bậc nhất hai ẩn",
                "semester": 1
            }
        ],
        "semester": 1
    },
    {
        "id": "c3",
        "name": "Hàm số và đồ thị",
        "lessons": [
            {
                "id": "l10_6",
                "name": "Hàm số",
                "semester": 1
            },
            {
                "id": "l10_7",
                "name": "Hàm số bậc hai",
                "semester": 1
            },
            {
                "id": "l10_8",
                "name": "Đồ thị hàm số bậc hai",
                "semester": 1
            }
        ],
        "semester": 1
    },
    {
        "id": "c4",
        "name": "Hệ thức lượng trong tam giác",
        "lessons": [
            {
                "id": "l10_9",
                "name": "Giá trị lượng giác của một góc từ 0° đến 180°",
                "semester": 1
            },
            {
                "id": "l10_10",
                "name": "Định lí côsin và định lí sin",
                "semester": 1
            },
            {
                "id": "l10_11",
                "name": "Giải tam giác và ứng dụng thực tế",
                "semester": 1
            }
        ],
        "semester": 1
    },
    {
        "id": "c5",
        "name": "Vectơ",
        "lessons": [
            {
                "id": "l10_12",
                "name": "Khái niệm vectơ",
                "semester": 1
            },
            {
                "id": "l10_13",
                "name": "Tổng và hiệu của hai vectơ",
                "semester": 1
            },
            {
                "id": "l10_14",
                "name": "Tích của một vectơ với một số",
                "semester": 1
            },
            {
                "id": "l10_15",
                "name": "Tích vô hướng của hai vectơ",
                "semester": 1
            }
        ],
        "semester": 1
    },
    {
        "id": "c6",
        "name": "Thống kê",
        "lessons": [
            {
                "id": "l10_16",
                "name": "Số gần đúng. Sai số",
                "semester": 1
            },
            {
                "id": "l10_17",
                "name": "Các số đặc trưng đo xu thế trung tâm",
                "semester": 1
            },
            {
                "id": "l10_18",
                "name": "Các số đặc trưng đo mức độ phân tán",
                "semester": 1
            }
        ],
        "semester": 1
    },
    {
        "id": "c7",
        "name": "Xác suất",
        "lessons": [
            {
                "id": "l10_19",
                "name": "Biến cố",
                "semester": 2
            },
            {
                "id": "l10_20",
                "name": "Xác suất",
                "semester": 2
            }
        ],
        "semester": 2
    }
],
  "11": [
    {
      "id": "c11_limit",
      "name": "Giới hạn",
      "semester": 1,
      "lessons": [
        { "id": "l11_limit1", "name": "Giới hạn của dãy số", "semester": 1 },
        { "id": "l11_limit2", "name": "Giới hạn hàm số", "semester": 1 }
      ]
    },
    {
      "id": "c11_deriv",
      "name": "Đạo hàm",
      "semester": 2,
      "lessons": [
        { "id": "l11_deriv1", "name": "Đạo hàm", "semester": 2 }
      ]
    },
    {
      "id": "c11_space",
      "name": "Hình học không gian",
      "semester": 2,
      "lessons": [
        { "id": "l11_space1", "name": "Quan hệ vuông góc", "semester": 2 }
      ]
    },
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
