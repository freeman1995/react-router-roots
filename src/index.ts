type RouteName = string;
type RoutePath = string;
type PathParamValue = string | number;

type JoinPaths<A extends RoutePath, B extends RoutePath> = "/" extends B
  ? A
  : `${A}/${B}`;

type ParentRoute = {
  path: RoutePath;
  children: RoutesPredicate;
};

export type RoutesPredicate = {
  [key: RouteName]: RoutePath | ParentRoute;
};

type AbsoluteRoutesPredicate = {
  [key: RouteName]: RoutePath | AbsoluteRoutesPredicate;
};

type AbsoluteRoutes<
  Routes extends RoutesPredicate,
  ParentRoutePath extends RoutePath = ""
> = {
  [RouteNameK in keyof Routes]: Routes[RouteNameK] extends ParentRoute
    ? AbsoluteRoutes<
        Routes[RouteNameK]["children"],
        JoinPaths<ParentRoutePath, Routes[RouteNameK]["path"]>
      >
    : Routes[RouteNameK] extends RoutePath
    ? JoinPaths<ParentRoutePath, Routes[RouteNameK]>
    : never;
};

type PathParamNameUnion<Path extends RoutePath> =
  Path extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? Param | PathParamNameUnion<Rest>
    : Path extends `${infer _Start}:${infer Param}`
    ? Param
    : never;

type ExtractPathParams<Path extends RoutePath> = Record<
  PathParamNameUnion<Path>,
  PathParamValue
>;

const isParentRoute = (
  routePathOrParentRoute: RoutePath | ParentRoute
): routePathOrParentRoute is ParentRoute =>
  typeof routePathOrParentRoute === "object";

export const makeAbsolute = <Routes extends RoutesPredicate>(
  routes: Routes,
  parentRoutePath = ""
): AbsoluteRoutes<Routes> =>
  Object.entries(routes).reduce<AbsoluteRoutesPredicate>(
    (acc, [routeName, route]) => ({
      ...acc,
      [routeName]: isParentRoute(route)
        ? makeAbsolute(route.children, `${parentRoutePath}${route.path}`)
        : `${parentRoutePath}${route}`,
    }),
    {}
  ) as AbsoluteRoutes<Routes>;

export const applyPathParams = <Path extends RoutePath>(
  path: Path,
  params: ExtractPathParams<Path>
) => {
  let resultPath: RoutePath = path;

  Object.entries(params).forEach(([pathParamName, pathParamValue]) => {
    resultPath = resultPath.replace(
      `:${pathParamName}`,
      (pathParamValue as PathParamValue).toString()
    );
  });

  return resultPath;
};
