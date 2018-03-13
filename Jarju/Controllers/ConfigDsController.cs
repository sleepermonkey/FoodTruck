using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using FoodTruck.aBiz;
using FoodTruck.aControl;
using System.Configuration;
using System.Globalization;

namespace Jarju.Controllers
{
    public class ConfigDsController : Controller
    {
        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["SYSDBName"];

        public JsonResult GetMenuTypeList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Menu_Type_List] {0}";
            gSQL = String.Format(gSQL, 
                        (Request.Form["ID"] != null && Request.Form["ID"] != "") ? "'" + Request.Form["ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public ContentResult EditMenuTypeConf()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Menu_Type_Update] '{0}', '{1}'";
            gSQL = String.Format(gSQL
                                , Request.Form["ID"]
                                , Request.Form["NAME"]);
            Response.Write(gSQL);
            Response.End();
            dt = odb.SqlQuery(gSQL, mDBName);

            return Content("Done");

        }

        public JsonResult GetMenuCategoryList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Menu_Category_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["ID"] != null && Request.Form["ID"] != "") ? "'" + Request.Form["ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public ContentResult EditMenuCategoryConf()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Menu_Category_Update] '{0}', '{1}'";
            gSQL = String.Format(gSQL
                                , Request.Form["ID"]
                                , Request.Form["NAME"]);
            Response.Write(gSQL);
            Response.End();
            dt = odb.SqlQuery(gSQL, mDBName);

            return Content("Done");

        }

        public JsonResult GetFoodMenuList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Menu_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["MENU_ID"] != null && Request.Form["MENU_ID"] != "") ? "'" + Request.Form["MENU_ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public ContentResult EditFoodMenuConf()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Menu_Update] '{0}','{1}','{2}','{3}'";
            gSQL = String.Format(gSQL
                                , Request.Form["MENU_ID"]
                                , Request.Form["NAME"]
                                , Request.Form["MENU_TYPE_ID"]
                                , Request.Form["MENU_CATE_ID"]);
            Response.Write(gSQL);
            Response.End();
            dt = odb.SqlQuery(gSQL, mDBName);

            return Content("Done");

        }

        public JsonResult GetBuffetPackageList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Buffet_Package_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["PACKAGE_ID"] != null && Request.Form["PACKAGE_ID"] != "") ? "'" + Request.Form["PACKAGE_ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetBuffetPackageCateList()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_Buffet_Package_Category_List] {0}";
            gSQL = String.Format(gSQL,
                        (Request.Form["PACKAGE_ID"] != null && Request.Form["PACKAGE_ID"] != "") ? "'" + Request.Form["PACKAGE_ID"] + "'" : "null");
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

        public JsonResult EditBuffetPackageConf()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Buffet_Package_Update] '{0}','{1}','{2}','{3}'";
            gSQL = String.Format(gSQL
                                , Request.Form["PACKAGE_ID"]
                                , Request.Form["NAME"]
                                , Request.Form["MIN_AMOUNT"]
                                , Request.Form["PRICE"]);
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);

        }

        public ContentResult EditBuffetPackageCategoryConf()
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [dbo].[sp_Buffet_Package_Category_Update] '{0}','{1}','{2}'";
            gSQL = String.Format(gSQL
                                , Request.Form["PACKAGE_ID"]
                                , Request.Form["ID"]
                                , Request.Form["MENU_AMOUNT"]);

            dt = odb.SqlQuery(gSQL, mDBName);

            return Content("Done");

        }
    }
}