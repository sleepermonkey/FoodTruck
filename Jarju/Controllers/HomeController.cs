using FoodTruck.aControl;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jarju.Controllers
{
    public class HomeController : Controller
    {
        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["BizDBName"];


        public ActionResult Index(string noti = "")
        {
            ViewBag.MessageNoti = noti;
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult Register()
        {
            return View();
        }

        public JsonResult GetRetailSalesMonth()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_STD_Retail_Month_List]";
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetRetailSalesYear()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_STD_Retail_Year_List]";
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetDealer()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_STD_Dealer_List] ";
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOutlet()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_STD_Outlet_List] ";
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }
    }
}