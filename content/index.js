(() => {
  "use strict";
  var e = {
    n: (t) => {
      var n = t && t.__esModule ? () => t.default : () => t;
      return e.d(n, { a: n }), n;
    },
    d: (t, n) => {
      for (var a in n)
        e.o(n, a) &&
          !e.o(t, a) &&
          Object.defineProperty(t, a, { enumerable: !0, get: n[a] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  };
  const t = axios;
  var n = e.n(t);
  (n().defaults.baseURL = "http://geek.itheima.net"),
    n().interceptors.request.use(
      function (e) {
        const t = localStorage.getItem("token");
        return t && (e.headers.Authorization = `Bearer ${t}`), e;
      },
      function (e) {
        return Promise.reject(e);
      }
    ),
    n().interceptors.response.use(
      function (e) {
        return e.data;
      },
      function (e) {
        return (
          console.dir(e),
          401 === e?.response?.status &&
            (alert("身份验证失败，请重新登录"),
            localStorage.clear(),
            (location.href = "../login/index.html")),
          Promise.reject(e)
        );
      }
    );
  const a = n();
  localStorage.getItem("token") || (location.href = "../login/index.html"),
    a({ url: "/v1_0/user/profile" }).then((e) => {
      const t = e.data.name;
      document.querySelector(".nick-name").innerHTML = t;
    }),
    document.querySelector(".quit").addEventListener("click", (e) => {
      localStorage.clear(), (location.href = "../login/index.html");
    });
  const r = { status: "", channel_id: "", page: 1, per_page: 2 };
  let o = 0;
  async function c() {
    const e = await a({ url: "/v1_0/mp/articles", params: r }),
      t = e.data.results
        .map(
          (e) =>
            `<tr>\n  <td>\n    <img src="${
              0 === e.cover.type
                ? "https://img2.baidu.com/it/u=2640406343,1419332367&amp;fm=253&amp;fmt=auto&amp;app=138&amp;f=JPEG?w=708&amp;h=500"
                : e.cover.images[0]
            }" alt="">\n  </td>\n  <td>${e.title}</td>\n  <td>\n    ${
              1 === e.status
                ? '<span class="badge text-bg-primary">待审核</span>'
                : '<span class="badge text-bg-success">审核通过</span>'
            }\n  </td>\n  <td>\n    <span>${
              e.pubdate
            }</span>\n  </td>\n  <td>\n    <span>${
              e.read_count
            }</span>\n  </td>\n  <td>\n    <span>${
              e.comment_count
            }</span>\n  </td>\n  <td>\n    <span>${
              e.like_count
            }</span>\n  </td>\n  <td data-id="${
              e.id
            }">\n    <i class="bi bi-pencil-square edit"></i>\n    <i class="bi bi-trash3 del"></i>\n  </td>\n</tr>`
        )
        .join("");
    (document.querySelector(".art-list").innerHTML = t),
      (o = e.data.total_count),
      (document.querySelector(".total-count").innerHTML = `共 ${o} 条`);
  }
  c(),
    (async function () {
      const e =
        '<option value="" selected="">请选择文章频道</option>' +
        (await a({ url: "/v1_0/channels" })).data.channels
          .map((e) => `<option value="${e.id}">${e.name}</option>`)
          .join("");
      document.querySelector(".form-select").innerHTML = e;
    })(),
    document.querySelectorAll(".form-check-input").forEach((e) => {
      e.addEventListener("change", (e) => {
        r.status = e.target.value;
      });
    }),
    document.querySelector(".form-select").addEventListener("change", (e) => {
      r.channel_id = e.target.value;
    }),
    document.querySelector(".sel-btn").addEventListener("click", () => {
      c();
    }),
    document.querySelector(".next").addEventListener("click", (e) => {
      r.page < Math.ceil(o / r.per_page) &&
        (r.page++,
        (document.querySelector(".page-now").innerHTML = `第 ${r.page} 页`),
        c());
    }),
    document.querySelector(".last").addEventListener("click", (e) => {
      r.page > 1 &&
        (r.page--,
        (document.querySelector(".page-now").innerHTML = `第 ${r.page} 页`),
        c());
    }),
    document.querySelector(".art-list").addEventListener("click", async (e) => {
      if (e.target.classList.contains("del")) {
        const t = e.target.parentNode.dataset.id;
        await a({ url: `/v1_0/mp/articles/${t}`, method: "DELETE" }),
          1 === document.querySelector(".art-list").children.length &&
            1 !== r.page &&
            (r.page--,
            (document.querySelector(
              ".page-now"
            ).innerHTML = `第 ${r.page} 页`)),
          c();
      }
    }),
    document.querySelector(".art-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("edit")) {
        const t = e.target.parentNode.dataset.id;
        console.log(t), (location.href = `../publish/index.html?id=${t}`);
      }
    });
})();
