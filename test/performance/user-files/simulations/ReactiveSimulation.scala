import java.time.LocalDateTime

import io.gatling.core.Predef._
import io.gatling.core.structure.ScenarioBuilder
import io.gatling.http.Predef._
import io.gatling.http.protocol.HttpProtocolBuilder
import jodd.util.RandomString
import scala.concurrent.duration._
import org.slf4j.{Logger, LoggerFactory}

class ReactiveSimulation extends Simulation {
  val logger: Logger = LoggerFactory.getLogger(classOf[Nothing])

  val authHeader = Map("Authorization" -> "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QxQHRlc3QucGwiLCJyb2xlIjoicmVzdGF1cmFudCIsImlkIjoiNWUwY2MwMWI5ZmNmMjA0NmI1N2U2NmYyIiwiaWF0IjoxNTc3ODkzOTgzfQ.H9MVz29H8m0FWZZ1_g6zzMp8jJZbJOQeNt0GOlrrd0M");

  val httpProtocol: HttpProtocolBuilder = http
    .baseURL("http://localhost:3000")
    .contentTypeHeader("application/json;charset=UTF-8")
    .acceptHeader("application/json;charset=UTF-8")

    val feeder: Iterator[Map[String, Any]] = Iterator.continually(
        Map("Email" -> newEmail()))


  val scn: ScenarioBuilder = scenario("ReactiveSimulation")
    .feed(feeder)
    .exec(
        http("registerRestaurant")
            .post("/restaurants/register")
            .body(StringBody("{ \"email\": \"${Email}\", \"password\": \"password\", \"name\": \"restaurantName\", \"city\": \"Łódź\", \"address\": \"al. Politechniki 113\" }"))
            .check(jsonPath("$.user").saveAs("userId"))
    )
    .exec(
        http("login")
            .post("/auth/login")
            .body(StringBody("{ \"email\": \"${Email}\", \"password\": \"password\" }"))
            .check()
    )
    .exec(
        http("createOrder")
            .post("/orders")
            .body(StringBody("{ \"restaurant\": \"${userId}\" }"))
            .headers(authHeader)
            .check(status.is(201))
    )
    .exec(
        http("ordersForRestaurant")
            .get("/orders/${userId}")
            .headers(authHeader)
            .check(status.is(200))
            .check()
    )

  setUp(scn.inject(atOnceUsers(10))).protocols(httpProtocol)
  //setUp(scn.inject( rampUsersPerSec(5) to 30 during(15 seconds))).protocols(httpProtocol)

  def newEmail(): String = RandomString.getInstance().randomAlpha(10)+"@test.pl"
}