using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Jarju.Controllers
{
    public class EventController : Controller
    {
        // GET: Configure
        public ActionResult CreateEvent()
        {
            ViewBag.PageTitle = "Create Event";
            return View();
        }

        public ActionResult MenuType()
        {
            ViewBag.PageTitle = "Menu Type";

            return View();
        }
    }
}