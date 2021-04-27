<template>
  <div class="home">
    <div class="header">
      <h1>Mật khẩu ngẫu nhiên</h1>
      <v-select
        :items="language"
        v-model="locale"
        @change="changeLocale"
        item-text="name"
        item-value="id"
      ></v-select>
    </div>
    <div class="content">
      <table>
        <tr>
          <td>Độ dài Mật khẩu</td>
          <td>
            <v-autocomplete
              :items="lengthList"
              v-model="passLength"
            ></v-autocomplete>
          </td>
        </tr>
        <tr v-for="item in functions" :key="item.name">
          <td>{{ item.name }}</td>
          <td>
            <div class="flex">
              <v-checkbox
                :id="item.model"
                v-model="item.model"
                color="info"
                :label="item.note"
              ></v-checkbox>
            </div>
          </td>
        </tr>
        <tr>
          <td>Tạo mật khẩu:</td>
          <td>
            <div class="flex">
              <v-btn color="primary" dark> Tạo mật khẩu </v-btn>
              <v-text-field
                v-model="password"
                label="Mật khẩu mới"
              ></v-text-field>
            </div>
          </td>
        </tr>
        <tr>
          <td>Lưu mật khẩu:</td>
          <td>
            <div class="flex">
              <router-link to="/login" v-if="!logged"
                ><v-btn color="success" dark> Đăng nhập </v-btn></router-link
              >
              <v-btn v-else color="success" dark> Lưu mật khẩu </v-btn>
              <p v-if="!logged">( Đăng nhập để lưu lại mật khẩu )</p>
            </div>
          </td>
        </tr>
        <tr v-if="!logged">
          <td>Đăng ký:</td>
          <td>
            <v-btn color="info" @click="register"> Đăng ký tự động </v-btn>
            <router-link to="/register">
              <v-btn color="warning" dark>
                Đăng ký bằng tay
              </v-btn></router-link
            >
          </td>
        </tr>
      </table>
    </div>
    <!-- <h1>{{ $t("welcomeMsg") }}</h1> -->
  </div>
</template>

<script>
import i18n from "../i18n";
export default {
  name: "Home",
  data() {
    return {
      language: [
        {
          id: "vi",
          name: "Tiếng Việt",
        },
        {
          id: "en",
          name: "English",
        },
      ],
      locale: "vi",
      lengthList: [],
      passLength: 16,
      useSymbol: true,
      useNumber: true,
      useLowercase: true,
      userUppercase: true,
      missSame: true,
      missComplex: true,
      makeOn: true,
      chooseAuto: true,
      password: "",
      functions: [
        {
          name: "Dùng Ký hiệu:",
          model: "useSymbol",
          note: "( ví dụ @#$% )",
        },
        {
          name: "Dùng Số:",
          model: "useNumber",
          note: "( ví dụ 123456 )",
        },
        {
          name: "Dùng các Ký tự viết Thường:",
          model: "useLowercase",
          note: "( ví dụ abcdefgh )",
        },
        {
          name: "Dùng các Ký tự viết Hoa:",
          model: "useUppercase",
          note: "( ví dụ ABCDEFGH )",
        },
        {
          name: "Loại trừ các Ký tự Giống nhau:",
          model: "missSame",
          note: "( ví dụ i, l, 1, L, o, 0, O )",
        },
        {
          name: "Loại trừ các Ký tự Nhập nhằng:",
          model: "missComplex",
          note: "( { } [ ] ( ) / ' ` ~ , ; : . < > )",
        },
        {
          name: "Tạo Trên Máy của Bạn:",
          model: "makeOn",
          note: "( KHÔNG tạo trên đám mây )",
        },
        {
          name: "Chọn tự động:",
          model: "chooseAuto",
          note: "( tự động chọn mật khẩu )",
        },
      ],
      logged: localStorage.getItem("token"),
    };
  },
  created() {
    for (let i = 6; i < 128; i++) {
      this.lengthList.push(i);
    }
  },
  methods: {
    changeLocale() {
      i18n.locale = this.locale;
    },
    register() {
      this.CallAPI("post", "user/auto", {}, (res) => {
        this.$toast.success("Đăng ký thành công");
        this.CallAPI(
          "post",
          "auth/login",
          {
            username: res.data.data[0].new_user.username,
            password: res.data.data[0].new_user.password,
          },
          (res) => {
            localStorage.setItem("token", res.data.data[0].token);
            localStorage.setItem("user", res.data.data[0].user);
            location.reload();
          }
        );
      });
    },
  },
};
</script>
<style>
.home {
  width: 1200px;
  margin: 50px auto;
  box-shadow: 0 0 10px #999;
  border-radius: 10px;
  padding: 30px 100px;
}
.home .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}
.home .header::before {
  content: "";
  height: 4px;
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: linear-gradient(to right, #3494e6 0%, #ec6ead 100%);
}
.home .header h1 {
  text-transform: uppercase;
  font-size: 28px;
  font-weight: 600;
  background: -webkit-linear-gradient(45deg, #3494e6, #ec6ead 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.v-select {
  max-width: 200px !important;
}
.content label {
  margin-bottom: 0 !important;
  color: #2c3e50 !important;
}
.content table {
  width: 100%;
}
.content table button {
  margin: 10px 0 !important;
  margin-right: 20px !important;
  width: 200px !important;
}
.content table td:first-child {
  width: 35%;
  font-weight: 600;
}
.content {
  margin-top: 30px;
}
.flex {
  display: flex;
  align-items: center;
}
p {
  margin: 0 !important;
}
a:hover {
  text-decoration: none !important;
}
</style>
