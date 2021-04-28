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
      <v-btn color="danger" @click="logout" v-if="logged"> Đăng xuất </v-btn>
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
        <tr>
          <td>Dùng Ký hiệu:</td>
          <td>
            <v-checkbox v-model="useSymbol" color="info" label="( ví dụ @#$% )">
            </v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Dùng Số:</td>
          <td>
            <v-checkbox
              v-model="useNumber"
              color="info"
              label="( ví dụ 123456 )"
            >
            </v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Dùng các Ký tự viết Thường:</td>
          <td>
            <v-checkbox
              v-model="useLowercase"
              color="info"
              label="( ví dụ abcdefgh )"
            >
            </v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Dùng các Ký tự viết Hoa:</td>
          <td>
            <v-checkbox
              v-model="userUppercase"
              color="info"
              label="( ví dụ ABCDEFGH )"
            >
            </v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Loại trừ các Ký tự Giống nhau:</td>
          <td>
            <v-checkbox
              v-model="missSame"
              color="info"
              label="( ví dụ i, l, 1, L, o, 0, O )"
            >
            </v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Nghiêm khắc:</td>
          <td>
            <v-checkbox
              v-model="strict"
              color="info"
              label="Mật khẩu phải bao gồm ít nhất một ký tự từ mỗi nhóm"
            >
            </v-checkbox>
          </td>
        </tr>
        <tr>
          <td>Loại trừ các ký tự:</td>
          <td>
            <v-text-field
              v-model="exclude"
              label="Chuỗi, ký tự được loại trừ khỏi mật khẩu"
              clearable
            ></v-text-field>
          </td>
        </tr>
        <tr>
          <td>Tạo mật khẩu:</td>
          <td>
            <div class="flex">
              <v-btn color="info" @click="makePassword" dark>
                Tạo mật khẩu
              </v-btn>
              <v-text-field
                id="password"
                v-model="password"
                label="Mật khẩu mới"
                clearable
                append-outer-icon="mdi-content-copy"
                @click:append-outer="copyPassword"
              ></v-text-field>
            </div>
          </td>
        </tr>
        <tr>
          <td>Lưu mật khẩu:</td>
          <td>
            <div class="flex">
              <span v-if="!logged" class="flex"
                ><router-link to="/login"
                  ><v-btn color="success" dark> Đăng nhập </v-btn></router-link
                >
                <p>( Đăng nhập để lưu lại mật khẩu )</p></span
              >

              <span v-else>
                <v-btn
                  color="success"
                  @click="dialog = true"
                  :disabled="password ? false : true"
                >
                  Lưu mật khẩu
                </v-btn>
                <router-link to="/manage"
                  ><v-btn color="info" dark>
                    Quản lý mật khẩu
                  </v-btn></router-link
                >
              </span>
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
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Thêm mật khẩu</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="username" label="Username" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="password" label="Mật khẩu" />
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="note" label="Ghi chú" />
              </v-col>
            </v-row>
            <v-alert type="warning" dense border="left" v-if="error">
              {{ error }}
            </v-alert>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="dialog = false">
            Hủy
          </v-btn>
          <v-btn color="blue darken-1" text @click="savePassword"> Lưu </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <h1>{{ $t("welcomeMsg") }}</h1> -->
  </div>
</template>

<script>
import i18n from "../i18n";
var generator = require("generate-password");
export default {
  name: "Home",
  data() {
    return {
      dialog: false,
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
      strict: true,
      exclude: "",
      password: "",
      username: "",
      note: "",
      error: "",
      logged: localStorage.getItem("token"),
    };
  },
  created() {
    for (let i = 6; i <= 128; i++) {
      this.lengthList.push(i);
    }
    this.lengthList.push(256, 512, 1024, 2048);
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
    makePassword() {
      if (
        !this.useNumber &&
        !this.useSymbol &&
        !this.useLowercase &&
        !this.userUppercase
      ) {
        this.$toast.error("Phải chọn 1 trong 4 loại ký tự");
        return;
      }
      this.password = generator.generate({
        length: this.passLength,
        numbers: this.useNumber,
        symbols: this.useSymbol,
        lowercase: this.useLowercase,
        uppercase: this.userUppercase,
        excludeSimilarCharacters: this.missSame,
        exclude: this.exclude,
        strict: this.strict,
      });
    },
    copyPassword() {
      var copyText = document.getElementById("password");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");
      if (this.password) {
        this.$toast.success("Copy thành công");
      }
    },
    savePassword() {
      if (!this.password) {
        this.error = "Mật khẩu không được để trống";
        return;
      }
      this.CallAPI(
        "post",
        "account",
        {
          username: this.username,
          password: this.password,
          note: this.note,
        },
        (res) => {
          this.$toast.success("Lưu mật khẩu thành công");
          this.dialog = false;
          this.username = "";
          this.note = "";
          this.error = "";
        }
      );
    },
    logout() {
      localStorage.clear();
      location.reload();
    },
  },
};
</script>