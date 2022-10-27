const firebaseConfig = {
  apiKey: "AIzaSyAzAG0a_ribj20DRAWaDNiw5B2wvtOcpYk",
  authDomain: "personid-9e533.firebaseapp.com",
  databaseURL: "https://personid-9e533-default-rtdb.firebaseio.com",
  projectId: "personid-9e533",
  storageBucket: "personid-9e533.appspot.com",
  messagingSenderId: "247603082330",
  appId: "1:247603082330:web:e71b378a57133300109463",
};

const dataSource = [];
firebase.initializeApp(firebaseConfig);
let db = firebase.database();

//?id üret
// let idKey = db.ref().child("/").push().key;

//* Hepsini siler
const deleteAll = (columnName) => {
  db.ref(columnName + "/").on("value", (data) => {
    Object.keys(data.val()).forEach((e) => {
      db.ref(columnName + "/" + e).remove();
    });
  });
};

//*ekleme yapar
const insert = (columnName, id, data) => {
  db.ref(columnName + "/" + id).set(data);
};

const todayDate = () => {
  const date = new Date();
  return { dataIsGetDate: date.toLocaleString("tr") };
};

//*Bütün verileri getir
const getAllData = async (columnName) => {
  let dataBarcode = [];
  await db.ref(columnName + "/").on("value", (data) => {
    Object.keys(data.val()).forEach((e) => {
      dataBarcode.push(data.val()[e]);
    });
  });
  return await dataBarcode;
};

//* Data Control
const dataControl = () => {
  const controlInterval = setInterval(() => {
    getAllData("Barcode").then((e) => {
      if (e.length > 0) {
        $.each(e, function (indexInArray, valueOfElement) {
          dataSource.push(valueOfElement.replace(" " , ""));
          const tableTr = `
            <tr>
            <td class="barcodeValue d-flex justify-content-around">
            <div id="barcodeNoP_${valueOfElement.replace(" ", "")}">
                  <p>${
                    "(  " +
                    (indexInArray + 1) +
                    "  ) " +
                    " &nbsp;&nbsp;&nbsp;&nbsp; " +
                    valueOfElement
                  }</p>
          </div>
            <div>
            <button class="btn btn-danger btnDeleteBarcode" id="${valueOfElement.replace(
              " ",
              ""
            )}">Sil</button>

            </div>          
                </td>
            </tr>
        `;

          $("#datatableTbody").append(tableTr);
        });

        clearInterval(controlInterval);
        barcodeDelte();
      }
    });
  }, 100);
};

dataControl();

//Barcode Ekle

//!Barcode eklerkende başarılı bir sonıç versin barkode veri tabanında yoksa eklesin varsa eklemesin
$("#barcodeSave").click(() => {
  const barcodeBarcode = $("#scan-result-text").text();
  const control = dataSource.filter((e) => e == barcodeBarcode);
  if (control.length == 0) {
    insert("Barcode", barcodeBarcode.replace(" ", ""), barcodeBarcode);
    Swal.fire({
      title: "Barcode Ekleniyor",
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        const htmlIndex = document.querySelectorAll(".barcodeValue").length + 1;
        const tableTr = `
        <tr>
        <td class="barcodeValue d-flex justify-content-around">
        <div id="barcodeNoP_${barcodeBarcode.replace(" ", "")}">
              <p>${
                "(  " +
                htmlIndex +
                "  ) " +
                " &nbsp;&nbsp;&nbsp;&nbsp; " +
                barcodeBarcode
              }</p>
        </div>
        <div>
        <button class="btn btn-danger btnDeleteBarcode" id="${barcodeBarcode.replace(
          " ",
          ""
        )}">Sil</button>
        
        </div>          
            </td>
        </tr>
    `;
        dataSource.push(barcodeBarcode);
        $("#datatableTbody").append(tableTr);
        barcodeDelte();
      }
    });
  } else if (control.length > 0) {
    Swal.fire("Bu Barkod Zaten Var", "Başka Bir Barkod Giriniz", "warning");
  } else {
    Swal.fire("Barkod Eklenirken Bir Hata Oluştu", "Tekrar Deneyiniz", "error");
  }
});

$("#deleteAll").click(() => {
  Swal.fire({
    title: "Barkodların Hepsini Silmek İstiyor musun ?",
    icon: "warning",
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("Başarılı", "Verileri Silme İşlemi Başlatıldı !", "success");
      deleteAll("Barcode/");
    }
  });
});

//Barcodu Sil

const barcodeDelte = () => {
  $(".btnDeleteBarcode").click((e) => {
    const dataAttr = $(e.target).attr("id");
    Swal.fire({
      title: `${dataAttr} Barkodunu Silmek İstiyor musnuz ?`,
      showCancelButton: true,
      confirmButtonText: "Evet",
      cancelButtonText: "Vazgeç",
      denyButtonText: `Hayır`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        db.ref("Barcode/" + dataAttr).set(null);
        Swal.fire("Silme İşlemi Başarılı", "", "success");
        $(e.target).hide(750);
        $("#barcodeNoP_" + dataAttr.replace(" ", "")).hide(750);

        removeItemAll(dataSource, dataAttr);

      }
    });
  });
};

//Remove Item
function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}
