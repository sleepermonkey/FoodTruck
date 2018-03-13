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
    public class SystemDsController : Controller
    {
        private DBManager odb = new DBManager();
        private String gSQL = "";
        private String mDBName = ConfigurationManager.AppSettings["SYSDBName"];

        [SessionExpire]
        public JsonResult GetHeaderGridView(string id)
        {
            DataTable dt = new DataTable();

            gSQL = "EXEC [sp_CONF_Grid_List] '{0}','{1}' ";
            gSQL = String.Format(gSQL, id, HttpContext.Session[Cons.SS_USER_LANG].ToString());
            dt = odb.SqlQuery(gSQL, mDBName);

            return Json(DTFM.convertToList(dt), JsonRequestBehavior.AllowGet);
        }

    }
}