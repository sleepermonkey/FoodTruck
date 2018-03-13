using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jarju.Controllers
{
    public class ConfigController : Controller
    {
        // GET: Configure
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MenuType()
        {
            ViewBag.PageTitle = "Menu Type";

            return View();
        }

        public ActionResult MenuCategory()
        {
            ViewBag.PageTitle = "Menu Category";

            return View();
        }

        public ActionResult FoodMenu()
        {
            ViewBag.PageTitle = "Food Menu";

            return View();
        }

        public ActionResult BuffetPackage()
        {
            ViewBag.PageTitle = "Buffet Package";

            return View();
        }
    }
}