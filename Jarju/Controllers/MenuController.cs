using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jarju.Controllers
{
    public class MenuController : Controller
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

        public ActionResult MenuStyle()
        {
            ViewBag.PageTitle = "Menu Style";

            return View();
        }

        public ActionResult Menu()
        {
            ViewBag.PageTitle = "Menu";

            return View();
        }
    }
}