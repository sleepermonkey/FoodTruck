using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jarju.Controllers
{
    public class OperationController : Controller
    {
        // GET: Configure
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Customer()
        {
            ViewBag.PageTitle = "Customer";

            return View();
        }

        public ActionResult Calendar()
        {
            ViewBag.PageTitle = "Calendar";

            return View();
        }

        public ActionResult TestGrid()
        {
            ViewBag.PageTitle = "TestGrid";

            return View();
        }

        public ActionResult AddEvent()
        {
            ViewBag.PageTitle = "Add event";

            return View();
        }
    }
}